require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//router imports
const usersRouter = require("./router/users.js");
const authRouter = require("./router/auth.js");

//middleware
app.use(express.json());
app.use(cookieParser());
//checking for express syntax error when invalid json body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ message: "ivalid json in the body" });
  }
  next();
});

//router
app.use("/users", usersRouter);
app.use("/auth", authRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log("server running at port:", PORT);
});
