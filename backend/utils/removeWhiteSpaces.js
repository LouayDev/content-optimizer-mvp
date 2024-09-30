const removeWhiteSpaces = (async = (html) => {
  return html.replace(/\s+/g, " ").trim();
});

module.exports = { removeWhiteSpaces };
