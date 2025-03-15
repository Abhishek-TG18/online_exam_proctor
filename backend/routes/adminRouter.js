const express = require("express");
const admin = require("./admin");
const router = express.Router();

router.use("/admin", admin);

module.exports = router;
