const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const port = 3000;
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");

app.use(bodyparser.json());
app.use(cors());

app.use("/api/v1", adminRouter);
app.use("/api/v2", userRouter);

app.get("/test", (req, res) => {
  res.send("Server working fine");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
