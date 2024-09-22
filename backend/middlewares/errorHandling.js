const express = require("express");
const app = express();

const invalidJsonInBody = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "ivalid json in the body" });
  }
  next();
};

module.exports = { invalidJsonInBody };
