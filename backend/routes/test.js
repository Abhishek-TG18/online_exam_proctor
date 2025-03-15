const express = require("express");
const router = express.Router();
const { executeCode } = require("../execution/execute");
const testMiddleWare = require("../middlewares/test");
const userMiddleWare = require("../middlewares/user");
const { Test, Course, Question, Result, Viva } = require("../db");
const z = require("zod");
const changeofquestionMiddleware = require("../middlewares/changeOfQuestion");
const demo = require("./demo");
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

router.use("/demo", demo);

router.get(
  "/:testId/question",
  userMiddleWare,
  testMiddleWare,
  async (req, res) => {
    try {
      const { testId } = req.params;

      const test = await Test.findById(testId).populate("courseId");
      if (!test) {
        return res.status(404).json({ error: "Test not found." });
      }

      const existing = await Result.findOne({
        testId,
        studentId: req.userId,
      });

      const course = await Course.findById(test.courseId).populate("questions");
      if (!course || !course.questions.length) {
        return res.status(404).json({
          error: "No questions available for the course linked to this test.",
        });
      }

      let randomQuestionId;

      if (existing?.questionId) {
        randomQuestionId = existing.questionId;
      } else {
        randomQuestionId =
          course.questions[Math.floor(Math.random() * course.questions.length)];
      }

      const question = await Question.findById(randomQuestionId);

      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      if (!existing) {
        const result = new Result({
          testId: test._id,
          studentId: req.userId,
          questionId: question._id,
          codingScore: 0,
          vivaScore: 0,
        });
        await result.save();
      }

      res.status(200).json({
        questionId: question._id,
        description: question.description,
        sampleTestCase: question.sampleTestCase,
        scheduledStart: test.scheduledOn,
      });
    } catch (error) {
      console.error("Error fetching question:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/:testId/run",
  userMiddleWare,
  testMiddleWare,
  async (req, res) => {
    try {
      const { questionId, language, version, code, testcase } = runSchema.parse(
        req.body
      );

      const test = req.test;
      const question = await Question.findById(questionId);

      if (!question) {
        return res.status(404).json({
          error: "Question not found or does not belong to this test.",
        });
      }

      const result = await executeCode(language, version, code, testcase.input);

      res.json({
        output: result.run.stdout || "",
        error: result.run.stderr || "",
        testCase: testcase,
      });
    } catch (error) {
      console.error("Error in /test/:testId/run endpoint:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/:testId/submit",
  userMiddleWare,
  testMiddleWare,
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

      const test = req.test;
      const question = await Question.findById(questionId);

      if (!question) {
        return res.status(404).json({
          error: "Question not found or does not belong to this test.",
        });
      }

      const studentId = req.userId;

      const existingResult = await Result.findOne({
        testId: test._id,
        studentId,
      });

      if (existingResult?.isCheated) {
        return res.status(200).json({
          isCheated: true,
          message: "Your typing pattern suggests possible copy-paste.",
        });
      }

      if (keyStrokeCount < Math.floor(codeLength * 0.6)) {
        // Copy detected
        if (existingResult) {
          existingResult.codingScore = 0;
          existingResult.isCheated = true;
          await existingResult.save();
        } else {
          const result = new Result({
            testId: req.test._id,
            studentId,
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
        return res
          .status(404)
          .json({ error: "No hidden test cases available for this question." });
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
          return res.json({
            error: result.run.stderr,
            message: "Error executing code !!",
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
      } else if (partialPassed > hiddenTestCases.length / 2) {
        codingScore = 5;
      }

      if (existingResult) {
        if (existingResult.codingScore !== 10) {
          existingResult.codingScore = codingScore;
          existingResult.code = code;
          await existingResult.save();
          return res.status(200).json({
            results,
            allPassed,
            codingScore,
            message: allPassed ? "Accepted" : "Failed for hidden testcase",
          });
        } else {
          return res.status(200).json({
            results,
            allPassed,
            codingScore,
            message: allPassed ? "Accepted" : "Failed for hidden testcase",
          });
        }
      } else {
        const result = new Result({
          testId: test._id,
          studentId,
          codingScore,
          vivaScore: 0,
          code,
        });
        await result.save();
        return res.status(200).json({
          results,
          allPassed,
          codingScore,
          message: allPassed ? "Accepted" : "Failed for hidden testcase",
        });
      }
    } catch (error) {
      console.error("Error in submission", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/:testId/viva-questions",
  userMiddleWare,
  testMiddleWare,
  async (req, res) => {
    try {
      const { testId } = req.params;

      const test = await Test.findById(testId).populate("courseId");

      if (!test || !test.courseId) {
        return res
          .status(404)
          .json({ error: "Test or associated course not found." });
      }

      const courseId = test.courseId;

      const course = await Course.findById(courseId).populate("vivaQuestions");

      if (
        !course ||
        !course.vivaQuestions ||
        course.vivaQuestions.length === 0
      ) {
        return res
          .status(404)
          .json({ error: "No viva questions found in the course." });
      }

      const randomQuestions = [];
      const vivaQuestions = course.vivaQuestions;

      while (randomQuestions.length < 5 && vivaQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * vivaQuestions.length);
        const selectedQuestion = vivaQuestions.splice(randomIndex, 1)[0];

        randomQuestions.push(selectedQuestion);
      }

      if (randomQuestions.length === 0) {
        return res
          .status(404)
          .json({ error: "Not enough viva questions in the course." });
      }

      res.status(200).json({
        message: "Random viva questions fetched successfully.",
        questions: randomQuestions,
      });
    } catch (error) {
      console.error("Error fetching viva questions:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/:questionId", testMiddleWare, userMiddleWare, async (req, res) => {
  try {
    const { questionId } = req.params;

    const vivaQuestion = await Viva.findById(questionId);

    if (!vivaQuestion) {
      return res.status(404).json({ error: "Viva question not found." });
    }

    const optionsWithoutCorrect = vivaQuestion.options.map((option) => {
      const { isCorrect, ...optionWithoutCorrect } = option.toObject();
      return optionWithoutCorrect;
    });

    res.status(200).json({
      message: "Viva question fetched successfully.",
      question: vivaQuestion.question,
      options: optionsWithoutCorrect,
    });
  } catch (error) {
    console.error("Error fetching viva question:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/:testId/viva-submit",
  userMiddleWare,
  testMiddleWare,
  async (req, res) => {
    try {
      const { testId } = req.params;
      const { questionId, answer } = req.body;

      if (!questionId || !answer) {
        return res
          .status(400)
          .json({ error: "Question ID and answer are required." });
      }

      const test = await Test.findById(testId).populate("courseId");
      if (!test || !test.courseId) {
        return res
          .status(404)
          .json({ error: "Test or associated course not found." });
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
      let result = await Result.findOne({ testId, studentId });

      if (!result) {
        result = new Result({
          testId,
          studentId,
          vivaScore: 0,
          codingScore: 0,
        });
      }

      if (isCorrect) {
        result.vivaScore += 1;
      }

      await result.save();

      res.status(200).json({
        message: isCorrect
          ? "Correct answer, viva score updated."
          : "Incorrect answer.",
        isCorrect,
        vivaScore: result.vivaScore,
      });
    } catch (error) {
      console.error("Error submitting viva answer:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/:testId/changeofquestion",
  userMiddleWare,
  testMiddleWare,
  changeofquestionMiddleware,
  async (req, res) => {
    try {
      const { testId } = req.params;

      const test = await Test.findById(testId).populate("courseId");
      if (!test) {
        return res.status(404).json({ error: "Test not found." });
      }

      if (!test.hasChangeOfQuestion) {
        return res.status(403).json({
          message: "No change of question for this test",
        });
      }

      const existing = await Result.findOne({
        testId,
        studentId: req.userId,
      });

      if (existing?.optedChangeOfQuestion) {
        return res.status(200).json({
          message: "You already opted change of question",
        });
      }

      const course = await Course.findById(test.courseId).populate("questions");
      if (!course || !course.questions.length) {
        return res.status(404).json({
          error: "No questions available for the course linked to this test.",
        });
      }

      if (course.questions.length === 1) {
        return res.status(400).json({
          error: "No alternative questions available in the course.",
        });
      }

      let randomQuestionId;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        randomQuestionId =
          course.questions[Math.floor(Math.random() * course.questions.length)]
            ._id;
        attempts++;

        if (attempts >= maxAttempts) {
          return res.status(500).json({
            error:
              "Failed to find a different question after multiple attempts.",
          });
        }
      } while (randomQuestionId.toString() === existing.questionId.toString());

      const question = await Question.findById(randomQuestionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      if (existing) {
        existing.questionId = randomQuestionId;
        existing.optedChangeOfQuestion = true;
        await existing.save();
      }

      res.status(200).json({
        questionId: question._id,
        description: question.description,
        sampleTestCase: question.sampleTestCase,
      });
    } catch (error) {
      console.error("Error fetching question:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/:testId/finish", userMiddleWare, async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.userId;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    const result = await Result.findOne({ testId, studentId: userId });

    if (!result) {
      return res.status(404).json({ error: "No result found for this user." });
    }

    if (result.isFinished) {
      return res.status(200).json({
        message: "Test for this user has already been completed.",
        result,
      });
    }

    if (result.optedChangeOfQuestion) {
      result.codingScore =
        result.codingScore - 3 > 0 ? result.codingScore - 3 : 0;
    }

    result.isFinished = true;
    await result.save();

    res.status(200).json({
      message: "Test marked as completed successfully for this user.",
      result,
    });
  } catch (error) {
    console.error("Error finishing the test for user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:testId/result", userMiddleWare, async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.userId;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    const result = await Result.findOne({ testId, studentId: userId });

    if (!result) {
      return res.status(404).json({ error: "No result found for this user." });
    }

    if (result.isFinished) {
      return res.status(200).json({
        message: "Test for this user has already been completed.",
        result,
      });
    }

    res.status(200).json({
      message: "Test is not yet finished.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
