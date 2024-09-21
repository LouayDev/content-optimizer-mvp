const fs = require("fs").promises;
const db = require("../db");
const isDateExpired = require("../utils/isDateExpired");

const authenticate = async (req, res, next) => {
  const sessionId = req.cookies["sessionId"];

  //checking for missing sessionId in cookie
  if (!sessionId) {
    return res
      .status(401)
      .json({ message: "unaothorized you dont have the session" });
  }

  try {
    const getUserSessionSQL = await fs.readFile("./sql/getUserSession.sql", {
      encoding: "UTF-8",
    });

    const userSessionResult = await db.query(getUserSessionSQL, [sessionId]);

    //checking for a missing session_id in the database
    if (userSessionResult.rows.length === 0) {
      res.clearCookie("sessionId");
      return res.status(401).json({
        message: "unaothorized session deso not exist in the database",
      });
    }

    const { user_id: db_user_id, expiration_date } = userSessionResult.rows[0];

    //checking for expired session
    if (isDateExpired(expiration_date)) {
      const clearUserSessionSQL = await fs.readFile(
        "./sql/clearUserSession.sql",
        {
          encoding: "UTF-8",
        }
      );
      await db.query(clearUserSessionSQL, [sessionId]);
      res.clearCookie("sessionId");
      res.status(401).json({ message: "unauthorized: session has expired" });
      return;
    }

    //getting the user by user_id and putting it in the req
    const getUserSQL = await fs.readFile("./sql/getUser.sql", {
      encoding: "UTF-8",
    });
    const userResult = await db.query(getUserSQL, [db_user_id]);
    const { user_password_hash, user_id, ...user } = userResult.rows[0];
    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

module.exports = authenticate;
