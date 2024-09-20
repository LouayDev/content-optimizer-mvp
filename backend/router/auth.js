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
  const userCookie = req.cookies["sessionId"];

  if (userCookie) {
    return res.status(403).json({ message: "you are already logged in" });
  }

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
    await client.query(newUserSessionSQL, [
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

module.exports = router;
