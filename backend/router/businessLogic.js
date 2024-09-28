const express = require("express");
const router = express.router();
const authenticate = require("../middlewares/authenticate");
const { isValidURL } = require("../utils/isValidUrl");

router.post("/fetch-html", authenticate, (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "url is required" });
  }
  if (url !== "" || !isValidURL(url)) {
    return res.status(400).json({ message: "url must be a type of string" });
  }
});
