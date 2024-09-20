const express = require("express");
const router = express.Router();
//files
const db = require("../db.js");
const userSchema = require("../../shared/schemas/user.js");
const { newExperationDate } = require("../utils/newExperationDate.js");
//libraries
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

router.post("/login", async (req, res) => {
  //checks for logged-in user
  const sessionId = req.cookies["sessionId"];
  if (sessionId) {
    return res.status(403).json({ message: "you are already logged in" });
  }

  //checks for the correct user credentials
  const { username, password } = req.body;
  const result = userSchema.safeParse({ username, password });
  if (!result.success) {
    return res.status(400).json({ message: result.error.issues[0].message });
  }

  //starting user login
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const checkUserSQL = await fs.readFile("./sql/checkUser.sql", {
      encoding: "UTF-8",
    });

    //checks for non-existing username
    const dbUser = await client.query(checkUserSQL, [username]);
    if (dbUser.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `username: ${username}, does not exist` });
    }

    //checks for correct password
    const user_password_hash = dbUser.rows[0].user_password_hash;
    const checkPassword = await bcrypt.compare(password, user_password_hash);
    if (!checkPassword) {
      return res.status(401).json({ message: "invalid password" });
    }

    //creating a new session for the user
    const sessionId = uuidv4();
    const user_id = dbUser.rows[0].user_id;
    const newUserSessionSQL = await fs.readFile("./sql/newUserSession.sql", {
      encoding: "UTF-8",
    });
    await client.query(newUserSessionSQL, [
      sessionId,
      user_id,
      newExperationDate(),
    ]);

    //responding with the sessionId in a cookie
    res.cookie("sessionId", sessionId, {
      maxAge: 604800000,
    });
    res.status(201).json({ message: "session created sucessfully" });

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(404).json({ err });
  } finally {
    client.release();
  }
});

router.post("/logout", async (req, res) => {
  const sessionId = req.cookies["sessionId"];

  if (!sessionId) {
    return res.status(403).json({ message: "you are already logged out" });
  }
  try {
    const clearUserSessionSQL = await fs.readFile(
      "./sql/clearUserSession.sql",
      {
        encoding: "UTF-8",
      }
    );
    await db.query(clearUserSessionSQL, [sessionId]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }

  res.clearCookie("sessionId");
  res.status(200).json({ message: "user has logged out sucessfully" });
});

module.exports = router;
