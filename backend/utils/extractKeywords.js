// Load wink-nlp package.
const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");
const BM25Vectorizer = require("wink-nlp/utilities/bm25-vectorizer");
// Instantiate winkNLP.
const nlp = winkNLP(model);
const its = nlp.its;
//getting the data
const mycorpus = require("../data.js");

//filtering out  unwanted words
const checkAllowedToken = (t) => {
  const tokenPOS = t.out(its.pos);
  if (tokenPOS == "I'm") {
    console.log("yes");
  }

  let passes = false;
  switch (tokenPOS) {
    case "PROPN":
      passes = true;
      break;
    case "NOUN":
      passes = true;
    case "ADJ":
      passes = true;
      break;
  }
  return passes;
};

//initializing bm25 vectorize and train it on the data
const bm25 = BM25Vectorizer();
mycorpus.forEach((doc) =>
  bm25.learn(
    nlp
      .readDoc(doc)
      .tokens()
      .filter((token) => checkAllowedToken(token))
      .out(its.lemma)
  )
);

//converting the bm25 output into an array and retaining only top 20 scores
const getTopScores = (tokenVectorObject) => {
  const tokenScorePairsArray = [];
  const sortedTokenScorePairsArray = [];
  for (const token in tokenVectorObject) {
    tokenVectorObject[token] > 0.7
      ? tokenScorePairsArray.push([token, tokenVectorObject[token]])
      : null;
  }

  tokenScorePairsArray.forEach((ar) => {
    sortedTokenScorePairsArray.push(ar.sort((a, b) => b[1] - a[1]));
  });
  return sortedTokenScorePairsArray;
};

console.log(getTopScores(bm25.doc(1).out()));
