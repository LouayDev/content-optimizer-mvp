//core
const express = require("express");
const router = express.Router();
//middlewares
const authenticate = require("../middlewares/authenticate");
//libraries
const puppeteer = require("puppeteer");
const sanitizeHTML = require("sanitize-html");
//utils
const { isValidURL } = require("../utils/isValidUrl");
const { removeWhiteSpaces } = require("../utils/removeWhiteSpaces");

router.post("/fetch-html", authenticate, async (req, res) => {
  const { url } = req.body;

  //checking if url exists & its valid
  if (!url) {
    return res.status(400).json({ message: "url is required" });
  }
  if (typeof url !== "string" || !isValidURL(url)) {
    return res.status(400).json({
      message: "url must be a type of stirng nad must be a valid url",
    });
  }

  try {
    //lunching the browser and opening a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //navigating to the specified url and extracing its content
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const dirtyHTML = await page.content();

    //sanitising the html from unwated tags and removing whitespaces
    const cleanHTML = await sanitizeHTML(dirtyHTML, {
      allowedTags: [
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "span",
        "strong",
        "em",
        "b",
        "i",
        "mark",
        "small",
        "del",
        "ins",
        "sub",
        "sup",
        "code",
        "pre",
        "blockquote",
        "q",
        "abbr",
        "cite",
        "dfn",
        "kbd",
        "samp",
        "var",
        "u",
        "ul",
        "ol",
        "li",
        "dl",
        "dt",
        "dd",
        "table",
        "tr",
        "th",
        "td",
      ],
    });
    const neetHTML = await removeWhiteSpaces(cleanHTML);

    //closing the browser and returning the response
    await browser.close();
    return res.json({
      html: neetHTML,
    });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

module.exports = router;
