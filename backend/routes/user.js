const express = require("express");
const router = express.Router();
const {
  User,
  Test,
  DemoResult,
  Result,
  OTP,
  PendingUser,
} = require("../db/index.js");
const jwt = require("jsonwebtoken");
const z = require("zod");
const bcrypt = require("bcrypt");
const { JWT_SECRET, saltRounds } = require("../config.js");
const userMiddleWare = require("../middlewares/user.js");
const test = require("./test.js");
const { DateTime } = require("luxon");
const { generateOTP, sendOTPEmail } = require("../utils/email.js");

const userSignupSchema = z
  .object({
    username: z.string(),
    usn: z.string().length(10, "USN should be exactly 10 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Enter password of minimum length 6"),
    batch: z.string().min(1, "Batch is required"),
    year: z.string().min(1, "Year is required"),
    branch: z.string().min(1, "Branch is required"),
  })
  .refine(
    (data) => data.email.toLowerCase().startsWith(data.usn.toLowerCase()),
    {
      message: "Email must start with your USN",
      path: ["email"],
    }
  );

const userSignInSchema = z.object({
  usn: z.string().min(10, "Username is required"),
  password: z.string().min(6, "Enter password of minimum length 6"),
});

router.use("/test", test);

//Sign Up route
router.post("/signup/init", async (req, res) => {
  try {
    const { username, email, usn, password, batch, year, branch } =
      userSignupSchema.parse(req.body);

    const existingUser = await User.findOne({ usn: usn.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email: email },
      { otp },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await PendingUser.findOneAndUpdate(
      { email: email },
      {
        username: username.toLowerCase(),
        email,
        password: hashedPassword,
        usn: usn.toLowerCase(),
        batch: batch.toLowerCase(),
        year,
        branch: branch.toLowerCase(),
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
    const { otp } = req.body;

    const pendingUser = await PendingUser.findOne({ email: req.body.email });
    if (!pendingUser) {
      return res.status(400).json({ message: "No pending signup found" });
    }

    const otpRecord = await OTP.findOne({
      email: pendingUser.email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const newUser = new User({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      usn: pendingUser.usn,
      batch: pendingUser.batch,
      year: pendingUser.year,
      branch: pendingUser.branch,
    });
    await newUser.save();

    await OTP.deleteOne({ email: pendingUser.email });
    await PendingUser.deleteOne({ email: pendingUser.email });

    const userId = newUser._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(200).json({
      message: "User created successfully",
      token: token,
      name: pendingUser.username,
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Internal server error", err });
  }
});

//Sign In route
router.post("/signin", async (req, res) => {
  try {
    const { usn, password } = userSignInSchema.parse(req.body);
    const user = await User.findOne({ usn: usn.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Incorrect username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(200).json({ token: token, name: user.username });
  } catch (err) {
    console.log("Error", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: "Internal server error", err });
  }
});

router.get("/demo-test", userMiddleWare, async (req, res) => {
  try {
    const demoTest = await Test.findOne({ course: "demo" });

    if (!demoTest) {
      return res.status(404).json({ message: "Demo test not found" });
    }

    demoTest.isCompleted = false;
    demoTest.scheduledOn = DateTime.now().setZone("Asia/Kolkata").toISO();

    await demoTest.save();

    res.status(200).json({ demoTest });
  } catch (err) {
    console.error("Error fetching demo test:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/tests", userMiddleWare, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentTime = DateTime.now().setZone("Asia/Kolkata");

    const tests = await Test.find({
      batch: user.batch.toLowerCase(),
      branch: user.branch.toLowerCase(),
      year: user.year,
    })
      .populate("courseId", "title")
      .sort({ scheduledOn: 1 });

    if (tests.length === 0) {
      return res.status(404).json({
        message: "There are no scheduled tests",
      });
    }

    const upcomingTests = tests.filter((test) => {
      const scheduledStart = DateTime.fromISO(test.scheduledOn, {
        zone: "Asia/Kolkata",
      });
      return scheduledStart.plus({ hours: 2 }) > currentTime;
    });

    if (upcomingTests.length === 0) {
      return res.status(404).json({
        message: "There are no upcoming tests",
      });
    }

    res.status(200).json({ tests: upcomingTests });
  } catch (err) {
    console.error("Error fetching tests for user batch:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/results", userMiddleWare, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const results = await Result.find({ studentId: userId });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this user" });
    }

    const resultsWithCourseInfo = await Promise.all(
      results.map(async (result) => {
        const test = await Test.findById(result.testId);
        if (!test) {
          throw new Error(`Test with ID ${result.testId} not found`);
        }

        return {
          ...result.toObject(),
          course: test.course,
          scheduledOn: test.scheduledOn,
        };
      })
    );

    res.status(200).json({ results: resultsWithCourseInfo });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/demo-results", userMiddleWare, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const demoResults = await DemoResult.find({ studentId: userId })
      .populate("testId")
      .populate("questionId");

    if (demoResults.length === 0) {
      return res
        .status(404)
        .json({ message: "No demo results found for this user" });
    }

    res.status(200).json({ demoResults });
  } catch (err) {
    console.error("Error fetching demo results:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
