const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { mongoUrl } = require("../config");

console.log(mongoUrl);
mongoose.connect(mongoUrl).then((conn) => console.log(`connected to DB: ${conn.connection.host}`))
.catch((err) => console.log(err.message));

//User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in$/,
      "Please enter a valid college email address ending with .ac.in",
    ],
  },
  usn: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  batch: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
});

//Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in$/,
      "Please enter a valid college email address ending with .ac.in",
    ],
  },
  password: { type: String, required: true },
  department: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  description: { type: String, required: true },

  sampleTestCase: {
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  hiddenTestCases: [
    {
      input: String,
      output: String,
      isHidden: { type: Boolean, default: true },
    },
  ],
});

const vivaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
});

//CourseSchema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  vivaQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Viva",
    },
  ],
});

//Test Schema
const TestSchema = new mongoose.Schema({
  course: { type: String, required: true },
  batch: { type: String, required: true },
  branch: {
    type: String,
    required: true,
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  year: { type: Number, required: true },
  scheduledOn: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  hasChangeOfQuestion: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

const demoResult = new mongoose.Schema({
  course: { type: String },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  codingScore: { type: Number, required: true },
  vivaScore: { type: Number, required: true },
  code: { type: String },
  isCheated: { type: Boolean, default: false },
  isFinished: { type: Boolean, default: false },
  optedChangeOfQuestion: { type: Boolean, default: false },
});

const resultSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  codingScore: { type: Number, required: true },
  vivaScore: { type: Number, required: true },
  code: { type: String },
  isCheated: { type: Boolean, default: false },
  isFinished: { type: Boolean, default: false },
  optedChangeOfQuestion: { type: Boolean, default: false },
});

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, expires: 300, default: Date.now },
});

const pendingUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  batch: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const pendingAdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Question = mongoose.model("Question", QuestionSchema);
const Test = mongoose.model("Test", TestSchema);
const Course = mongoose.model("Course", courseSchema);
const Viva = mongoose.model("Viva", vivaSchema);
const Result = mongoose.model("Result", resultSchema);
const DemoResult = mongoose.model("DemoResult", demoResult);
const OTP = mongoose.model("OTP", otpSchema);
const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
const PendingAdmin = mongoose.model("PendingAdmin", pendingAdminSchema);

module.exports = {
  User,
  Admin,
  Question,
  Test,
  Course,
  Viva,
  Result,
  DemoResult,
  OTP,
  PendingUser,
  PendingAdmin,
};
