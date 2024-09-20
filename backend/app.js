require("dotenv").config();
const express = require("express");
const app = express();
const userSchema = require("../shared/schemas/user.js");
const z = require("zod");
const db = require("./db.js");
const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const { newExperationDate } = require("./utils/newExperationDate.js");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");

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

app.get("/", (req, res) => {
  res.send("hello there");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const result = userSchema.safeParse({ username, password });

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues[0].message });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUserSql = await fs.readFile("./sql/createUser.sql", {
      encoding: "UTF-8",
    });
    const response = await db.query(createUserSql, [username, hashedPassword]);

    res.status(201).json({ message: "user created sucessfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "we dont know what the fuck is going on wait" });
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const result = userSchema.safeParse({ username, password });

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues[0].message });
  }

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");
    const checkUserSQL = await fs.readFile("./sql/checkUser.sql", {
      encoding: "UTF-8",
    });
    const result = await client.query(checkUserSQL, [username]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `username: ${username}, does not exist` });
    }

    const user_password_hash = result.rows[0].user_password_hash;
    const check = await bcrypt.compare(password, user_password_hash);

    if (!check) {
      return res.status(401).json({ message: "invalid password" });
    }

    const sessionId = uuidv4();
    const user_id = result.rows[0].user_id;
    const newUserSessionSQL = await fs.readFile("./sql/newUserSession.sql", {
      encoding: "UTF-8",
    });
    const newSessionResult = await client.query(newUserSessionSQL, [
      sessionId,
      user_id,
      newExperationDate(),
    ]);

    res.cookie("sessionId", sessionId, {
      maxAge: 604800000,
    });
    res.status(201).json({ message: "session created sucessfully" });

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(404).json({ err });
  } finally {
    client.release();
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log("server running at port:", PORT);
});
