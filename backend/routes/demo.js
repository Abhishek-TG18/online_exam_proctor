const express = require("express");
const router = express.Router();
const { executeCode } = require("../execution/execute");
const userMiddleWare = require("../middlewares/user");
const { Test, Course, Question, DemoResult, Viva } = require("../db");
const z = require("zod");

const runSchema = z.object({
  questionId: z.string(),
  language: z.string(),
  version: z.string(),
  code: z.string(),
  testcase: z.object({
    input: z.string(),
  }),
});

const submitSchema = z.object({
  questionId: z.string(),
  language: z.string(),
  version: z.string(),
  code: z.string(),
  codeLength: z.number(),
  keyStrokeCount: z.number(),
});

const preventFinishedMiddleware = async (req, res, next) => {
  try {
    const demoTest = await Test.findOne({ course: "demo" });

    if (!demoTest) {
      return res.status(404).json({ error: "Demo test not found." });
    }

    const userId = req.userId;
    const result = await DemoResult.findOne({
      testId: demoTest._id,
      studentId: userId,
    });

    if (result && result.isFinished) {
      return res.status(403).json({
        error:
          "You have already completed the demo test and cannot access this route.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in preventFinishedMiddleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.get(
  "/question",
  userMiddleWare,
  preventFinishedMiddleware,
  async (req, res) => {
    try {
      const demoTest = await Test.findOne({ course: "demo" }).populate(
        "courseId"
      );
      if (!demoTest) {
        return res.status(404).json({ error: "Demo test not found." });
      }

      const course = await Course.findById(demoTest.courseId).populate(
        "questions"
      );
      if (!course || !course.questions.length) {
        return res.status(404).json({
          error:
            "No questions available for the course linked to the demo test.",
        });
      }

      const randomQuestionId =
        course.questions[Math.floor(Math.random() * course.questions.length)];

      const question = await Question.findById(randomQuestionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      res.status(200).json({
        questionId: question._id,
        description: question.description,
        sampleTestCase: question.sampleTestCase,
        scheduledOn: demoTest.scheduledOn,
      });
    } catch (error) {
      console.error("Error fetching question for demo test:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/run",
  userMiddleWare,
  preventFinishedMiddleware,
  async (req, res) => {
    try {
      const { questionId, language, version, code, testcase } = runSchema.parse(
        req.body
      );

      const demoTest = await Test.findOne({ course: "demo" }).populate(
        "courseId"
      );
      if (!demoTest) {
        return res.status(404).json({ error: "Demo test not found." });
      }

      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      const result = await executeCode(language, version, code, testcase.input);
      res.status(200).json({
        output: result.run.stdout || "",
        error: result.run.stderr || "",
        testCase: testcase,
      });
    } catch (error) {
      console.error("Error in /run endpoint:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/submit",
  userMiddleWare,
  preventFinishedMiddleware,
  async (req, res) => {
    try {
      const {
        questionId,
        language,
        version,
        code,
        codeLength,
        keyStrokeCount,
      } = submitSchema.parse(req.body);

      const demoTest = await Test.findOne({ course: "demo" }).populate(
        "courseId"
      );
      if (!demoTest) {
        return res.status(404).json({ error: "Demo test not found." });
      }

      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({
          error: "Question not found or does not belong to the demo test.",
        });
      }

      const isCheated = keyStrokeCount < Math.floor(codeLength * 0.6);
      if (isCheated) {
        const existingResult = await DemoResult.findOne({
          testId: demoTest._id,
          studentId: req.userId,
          questionId,
        });

        if (existingResult) {
          existingResult.isCheated = true;
          existingResult.codingScore = Math.min(existingResult.codingScore, 0);
          existingResult.code = code;
          await existingResult.save();
        } else {
          const result = new DemoResult({
            testId: demoTest._id,
            studentId: req.userId,
            questionId,
            codingScore: 0,
            vivaScore: 0,
            code,
            isCheated: true,
          });
          await result.save();
        }

        return res.status(200).json({
          isCheated: true,
          message: "Your typing pattern suggests possible copy-paste.",
        });
      }

      const hiddenTestCases = question.hiddenTestCases;
      if (!hiddenTestCases || hiddenTestCases.length === 0) {
        return res.status(404).json({
          error: "No hidden test cases available for this question.",
        });
      }

      const results = [];
      for (const testCase of hiddenTestCases) {
        const result = await executeCode(
          language,
          version,
          code,
          testCase.input
        );
        if (result.run.stderr) {
          return res.status(400).json({
            error: result.run.stderr,
            message: "Error executing code!",
          });
        }
        const output = result.run.stdout.trim();
        results.push({
          input: testCase.input,
          expected: testCase.output.trim(),
          output,
          Accepted: output === testCase.output.trim(),
        });
      }

      const allPassed = results.every((testResult) => testResult.Accepted);
      const partialPassed = results.filter(
        (testResult) => testResult.Accepted
      ).length;

      let codingScore = 0;
      if (allPassed) {
        codingScore = 10;
      } else if (partialPassed > 0) {
        codingScore = 5;
      }

      const existingResult = await DemoResult.findOne({
        testId: demoTest._id,
        studentId: req.userId,
        questionId,
      });

      if (existingResult) {
        if (codingScore > existingResult.codingScore) {
          existingResult.codingScore = codingScore;
          existingResult.code = code;
          existingResult.isCheated = false;
          await existingResult.save();
        }
      } else {
        const result = new DemoResult({
          course: "demo",
          testId: demoTest._id,
          studentId: req.userId,
          questionId,
          codingScore,
          vivaScore: 0,
          code,
          isCheated: false,
        });
        await result.save();
      }

      res.status(200).json({
        results,
        allPassed,
        codingScore,
        message: allPassed ? "Accepted" : "Failed for hidden test case(s)",
      });
    } catch (error) {
      console.error("Error in demo test submission:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/viva-questions",
  userMiddleWare,
  preventFinishedMiddleware,
  async (req, res) => {
    try {
      const demoTest = await Test.findOne({ course: "demo" }).populate(
        "courseId"
      );

      if (!demoTest) {
        return res.status(404).json({ error: "Demo test not found." });
      }

      const course = await Course.findById(demoTest.courseId).populate(
        "vivaQuestions"
      );

      if (
        !course ||
        !course.vivaQuestions ||
        course.vivaQuestions.length === 0
      ) {
        return res
          .status(404)
          .json({ error: "No viva questions available for the demo test." });
      }

      const randomQuestions = [];
      const vivaQuestions = [...course.vivaQuestions];

      while (randomQuestions.length < 5 && vivaQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * vivaQuestions.length);
        const selectedQuestion = vivaQuestions.splice(randomIndex, 1)[0];

        randomQuestions.push(selectedQuestion);
      }

      if (randomQuestions.length === 0) {
        return res.status(404).json({
          error: "Not enough viva questions available for the demo test.",
        });
      }

      res.status(200).json({
        message: "Random viva questions fetched successfully for demo test.",
        questions: randomQuestions,
      });
    } catch (error) {
      console.error(
        "Error fetching viva questions for demo test:",
        error.message
      );
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/viva-submit",
  userMiddleWare,
  preventFinishedMiddleware,
  async (req, res) => {
    try {
      const { questionId, answer } = req.body;

      if (!questionId || !answer) {
        return res
          .status(400)
          .json({ error: "Question ID and answer are required." });
      }

      const vivaQuestion = await Viva.findById(questionId);
      if (!vivaQuestion) {
        return res.status(404).json({ error: "Viva question not found." });
      }

      const correctOption = vivaQuestion.options.find(
        (option) => option.isCorrect
      );
      if (!correctOption) {
        return res
          .status(404)
          .json({ error: "No correct answer found for this question." });
      }

      const isCorrect = answer === correctOption.text;

      const studentId = req.userId;

      let demoResult = await DemoResult.findOne({
        course: "demo",
        studentId,
      });
      if (!demoResult) {
        demoResult = new DemoResult({
          course: "demo",
          studentId,
          vivaScore: 0,
        });
      }

      if (isCorrect) {
        demoResult.vivaScore += 1;
      }

      await demoResult.save();

      res.status(200).json({
        message: isCorrect
          ? "Correct answer, viva score updated."
          : "Incorrect answer.",
        isCorrect,
        vivaScore: demoResult.vivaScore,
      });
    } catch (error) {
      console.error("Error submitting demo viva answer:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/finish",
  userMiddleWare,
  preventFinishedMiddleware,
  async (req, res) => {
    try {
      const demoTest = await Test.findOne({ course: "demo" });

      if (!demoTest) {
        return res.status(404).json({ error: "Demo test not found." });
      }

      const userId = req.userId;
      const result = await DemoResult.findOne({
        testId: demoTest._id,
        studentId: userId,
      });

      if (!result) {
        return res
          .status(404)
          .json({ error: "No demo test result found for this user." });
      }

      if (result.isFinished) {
        return res.status(200).json({
          message: "Demo test for this user has already been completed.",
        });
      }

      result.isFinished = true;
      await result.save();

      res.status(200).json({
        message: "Demo test marked as completed successfully for this user.",
        testId: demoTest._id,
        userId: userId,
        completedOn: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error finishing the demo test for user:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
