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

//getting the average wordcount for the top 3 websites
const getPageWordCount = async (url) => {
  if (!isValidURL(url)) {
    throw new Error("url argument must be a valid url");
  }

  const totalWordCount = 0;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const textContent = await page.evaluate(() => {
      return document.body.innerText;
    });
    const wordCount = textContent.split(/\s+/).length;
    console.log(`word count for ${url} is: `, wordCount);
    await browser.close();
  } catch (err) {
    throw err;
  }

  return totalWordCount / 3;
};

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
    const browser = await puppeteer.launch({ headless: true });
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
      // target_wordcount:
    });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

module.exports = router;

//retrieving the top three urls for a given query
const getTopThreeWebsitesURL = async (query) => {
  let topThreeUrls = [];

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://www.google.com");
    await page.type("#APjFqb", query);
    await page.keyboard.press("Enter");
    await page.waitForSelector("h3");

    const topThreeLinks = await page.$$eval("a h3", (anchors) => {
      return anchors.slice(0, 3).map((anchor) => anchor.closest("a").href);
    });
  } catch (err) {
    console.log("getTopThreeWebsitesURL err: ", err);
    throw err;
  }
};
