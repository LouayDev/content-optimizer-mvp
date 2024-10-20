const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const db = require("../db");
const userSchema = require("../../shared/schemas/user.js");
const authenticateMiddleware = require("../middlewares/authenticate.js");
router.post("/newUser", async (req, res) => {
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

    await db.query(createUserSql, [username, hashedPassword]);
    res.status(201).json({ message: "user created sucessfully" });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "we dont know what the fuck is going on wait" });
  }
});

router.get("/info", authenticateMiddleware, (req, res) => {
  res.status(200).json(req.user);
});
module.exports = router;
