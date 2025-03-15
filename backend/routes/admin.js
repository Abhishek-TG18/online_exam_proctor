const express = require("express");
const router = express.Router();
const {
  Admin,
  Question,
  Test,
  Course,
  Viva,
  OTP,
  PendingAdmin,
} = require("../db/index.js");
const z = require("zod");
const bcrypt = require("bcrypt");
const { JWT_SECRET, saltRounds } = require("../config");
const jwt = require("jsonwebtoken");
const adminMiddleWare = require("../middlewares/admin.js");
const { DateTime } = require("luxon");
const { generateOTP, sendOTPEmail } = require("../utils/email.js");
const test = require("./adminTest.js");

const adminSignUpSchema = z.object({
  username: z.string(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  department: z.string(),
});

const adminSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

router.use("/test", test);

//Sign Up route
router.post("/signup/init", async (req, res) => {
  try {
    const { username, email, password, department } = adminSignUpSchema.parse(
      req.body
    );

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin account already exists" });
    }

    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await PendingAdmin.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        department: department.toLowerCase(),
      },
      { upsert: true }
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: "Internal server error", err });
  }
});

router.post("/signup/verify", async (req, res) => {
  try {
    const { otp, email } = req.body;

    const pendingAdmin = await PendingAdmin.findOne({
      email: email.toLowerCase(),
    });
    if (!pendingAdmin) {
      return res.status(400).json({ message: "No pending signup found" });
    }

    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const newAdmin = new Admin({
      username: pendingAdmin.username,
      email: pendingAdmin.email,
      password: pendingAdmin.password,
      department: pendingAdmin.department,
    });

    await newAdmin.save();
    await OTP.deleteOne({ email: pendingAdmin.email });
    await PendingAdmin.deleteOne({ email: pendingAdmin.email });

    const userId = newAdmin._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(200).json({
      message: "Admin account created successfully",
      token: token,
      name: pendingAdmin.username,
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal server error", err });
  }
});

//Sign In route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = adminSignInSchema.parse(req.body);
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Incorrect username" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const userId = admin._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(200).json({ token: token, name: admin.username });
  } catch (err) {
    console.log("Error", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: "Internal server error", err });
  }
});

router.post("/question", adminMiddleWare, async (req, res) => {
  try {
    const { coursetitle, description, sampleTestCase, hiddenTestCases } =
      req.body;
    if (
      !description ||
      !sampleTestCase ||
      !sampleTestCase.input ||
      !sampleTestCase.output ||
      !coursetitle
    ) {
      return res.status(400).json({
        message:
          "Coursetitle, Description and sample test case with output are required",
      });
    }

    const newQuestion = new Question({
      description,
      sampleTestCase: {
        input: sampleTestCase.input,
        output: sampleTestCase.output,
        isHidden: sampleTestCase.isHidden || false,
      },
      hiddenTestCases: hiddenTestCases || [],
    });

    const savedQuestion = await newQuestion.save();

    let course = await Course.findOne({ title: coursetitle.toLowerCase() });

    if (!course) {
      course = new Course({
        title: coursetitle.toLowerCase(),
        questions: [savedQuestion._id],
      });
      await course.save(); // Save the new course
      return res.status(200).json({
        message: "Course created and question added successfully",
      });
    }

    course.questions.push(savedQuestion._id);

    await course.save();

    res.status(200).json({
      message: "Question added successfully to the course",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/vivaquestion", adminMiddleWare, async (req, res) => {
  try {
    const { coursetitle, question, options } = req.body;

    if (!question || !options || !coursetitle) {
      return res.status(400).json({
        message: "Coursetitle, Question, and Options are required",
      });
    }

    const correctOption = options.find((option) => option.isCorrect === true);
    if (!correctOption) {
      return res.status(400).json({
        message: "At least one option must be marked as correct.",
      });
    }

    const newVivaQuestion = new Viva({
      question,
      options: options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect || false,
      })),
    });

    const savedVivaQuestion = await newVivaQuestion.save();

    let course = await Course.findOne({ title: coursetitle.toLowerCase() });

    if (!course) {
      course = new Course({
        title: coursetitle.toLowerCase(),
        vivaQuestions: [savedVivaQuestion._id],
      });
      await course.save(); // Save the new course
      return res.status(200).json({
        message: "Course created and viva question added successfully",
      });
    }

    course.vivaQuestions.push(savedVivaQuestion._id);

    await course.save();

    res.status(200).json({
      message: "Viva question added successfully to the course",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/courses", adminMiddleWare, async (req, res) => {
  try {
    const courses = await Course.find().select("title");

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/scheduletest", adminMiddleWare, async (req, res) => {
  try {
    const { courseId, batch, branch, year, scheduledOn, hasChangeOfQuestion } =
      req.body;

    if (!courseId || !batch || !branch || !year || !scheduledOn) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const parsedDate = DateTime.fromISO(scheduledOn, { zone: "Asia/Kolkata" });
    if (!parsedDate.isValid) {
      return res.status(400).json({ message: "Invalid scheduledOn format." });
    }

    const scheduledOnIST = parsedDate.toISO();

    const foundCourse = await Course.findOne({ _id: courseId });
    if (!foundCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!foundCourse.questions || foundCourse.questions.length === 0) {
      return res.status(400).json({
        message: "Course must have questions before scheduling a test.",
      });
    }

    if (!foundCourse.vivaQuestions || foundCourse.vivaQuestions.length === 0) {
      return res.status(400).json({
        message: "Course must have viva questions before scheduling a test.",
      });
    }

    const newTest = new Test({
      course: foundCourse.title,
      batch: batch.toLowerCase(),
      branch: branch.toLowerCase(),
      courseId,
      year,
      scheduledOn: scheduledOnIST,
      createdBy: req.userId,
    });

    if (hasChangeOfQuestion) {
      newTest.hasChangeOfQuestion = true;
    }

    await newTest.save();

    res.status(200).json({
      message: "Test created and scheduled successfully",
    });
  } catch (err) {
    console.error("Error in /scheduletest route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
