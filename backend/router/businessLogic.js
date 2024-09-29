const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { isValidURL } = require("../utils/isValidUrl");
const axios = require("axios");
const fs = require("fs").promises;
const puppeteer = require("puppeteer");

router.post("/fetch-html", authenticate, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "url is required" });
  }
  if (typeof url !== "string" || !isValidURL(url)) {
    return res.status(400).json({
      message: "url must be a type of stirng nad must be a valid url",
    });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const specificTagsHTML = await page.evaluate(() => {
      const tags = Array.from(
        document.querySelectorAll(
          "a, p, span, button, ul, li, ol, h1, h2, h3, h6"
        )
      );

      // Return the outer HTML of each matching element
      return tags.map((tag) => tag.outerHTML).join("\n");
    });

    await fs.writeFile("test.html", specificTagsHTML);
    await browser.close();

    res.json({ message: "all good" });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

module.exports = router;
