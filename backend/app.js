require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { invalidJsonInBody } = require("./middlewares/errorHandling.js");
const cors = require("cors");

//router imports
const usersRouter = require("./router/users.js");
const authRouter = require("./router/auth.js");
const businessLogicRouter = require("./router/businessLogic.js");

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
//checking for express syntax error when invalid json body
app.use(invalidJsonInBody);

//router
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/business-logic", businessLogicRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log("server running at port:", PORT);
});
