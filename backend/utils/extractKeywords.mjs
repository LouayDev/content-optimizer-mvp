import { bigram, trigram } from "n-gram";

// Load wink-nlp package.
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";

// Instantiate winkNLP.
const nlp = winkNLP(model);
const its = nlp.its;

const preppedTokens = (text) => {
  const doc = nlp.readDoc(text);
  const tokens = doc
    .tokens()
    .filter((t) => {
      return (
        t.out(its.type) === "word" &&
        !t.out(its.stopWordFlag) &&
        !t.out(its.negationFlag)
      );
    })
    .out(its.lemma);
  return tokens;
};

//this function takes an array of text each one represents a document
const getTokensCollection = (corpus) => {
  const tokensCollection = [];
  corpus.forEach((document) => {
    tokensCollection.push(preppedTokens(document));
  });
  console.log(tokensCollection);
};
getTokensCollection(mycorpus);
