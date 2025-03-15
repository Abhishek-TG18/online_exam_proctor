const express = require("express");
const { Test, Result } = require("../db/index");
const adminMiddleWare = require("../middlewares/admin");
const { DateTime } = require("luxon");

const router = express.Router();

router.get("/tests", adminMiddleWare, async (req, res) => {
  try {
    const adminId = req.userId;
    const now = DateTime.now()
      .setZone("Asia/Kolkata")
      .minus({ hours: 2 })
      .toISO();

    const tests = await Test.find({
      createdBy: adminId,
      scheduledOn: {
        $lt: now,
      },
    })
      .populate("courseId")
      .sort({ scheduledOn: -1 })
      .exec();

    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tests" });
  }
});

router.get("/generate-csv/:testId", adminMiddleWare, async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    const results = await Result.find({ testId }).populate("studentId").exec();

    let csv = "Test Results\n";
    csv += `Course,${test.course.toUpperCase()}\n`;
    csv += `Branch,${test.branch.toUpperCase()}\n`;
    csv += `Year,${test.year}\n`;
    csv += `Batch,${test.batch.toUpperCase()}\n`;
    csv += `Date,${test.scheduledOn}\n\n`;

    csv +=
      "USN,Opted Change of Question,Is Cheated,Coding Score,Viva Score,Total Score\n";

    results.forEach((result) => {
      csv += `${result.studentId.usn.toUpperCase()},`;
      csv += `${result.optedChangeOfQuestion ? "Yes" : "No"},`;
      csv += `${result.isCheated ? "Yes" : "No"},`;
      csv += `${result.codingScore},`;
      csv += `${result.vivaScore},`;
      csv += `${result.codingScore + result.vivaScore}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`test_results_${testId}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating CSV" });
  }
});

module.exports = router;
