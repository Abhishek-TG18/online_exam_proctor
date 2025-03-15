const { DateTime } = require("luxon");

const changeofquestionMiddleware = (req, res, next) => {
  try {
    const scheduledStart = req.scheduledStart;

    if (!scheduledStart) {
      return res.status(500).json({ error: "Scheduled start time not found." });
    }

    const now = DateTime.now().setZone("Asia/Kolkata");
    const thirtyMinutesAfterStart = scheduledStart.plus({ minutes: 30 });

    if (now < thirtyMinutesAfterStart) {
      return res.status(403).json({
        error: "This action is only allowed 30 minutes after the test starts.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in changeofquestionMiddleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = changeofquestionMiddleware;
