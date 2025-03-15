const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const mongoUrl = process.env.MONGO_URL;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const EXECUTION_URL = process.env.EXECUTION_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

module.exports = {
  JWT_SECRET,
  saltRounds,
  mongoUrl,
  EXECUTION_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
};
