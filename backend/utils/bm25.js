//calculating Tf score
const calculateTF = (tf, k, b, dl, adl) => {
  const TFscore = tf / (tf + k * (1 - b + (b * dl) / adl));
  return TFscore;
};

//calculate IDF
const calculateIDF = (N, DF) => {
  if (DF === 0) return 0;
  const score = Math.log(1 + (N - DF + 0.5) / (DF + 0.5));
  return score;
};

//calculate bm25 score for a particular term
const calculateBM25score = (tf, k, b, dl, adl, N, DF) => {
  score = calculateTF(tf, k, b, dl, adl) * calculateIDF(N, DF);
  return score;
};

//extract most relevant keywords
const getTokebBM25scoreArray = (corpus) => {
  const k = 1.2;
  const b = 0.75;
  const N = corpus.length;
  const adl =
    corpus.reduce((totalLength, doc) => totalLength + doc.length, 0) /
    corpus.length;
  const termsWithBM25score = [];
  const listOfTokens = [];
  for (i = 0; i < corpus.length; i++) {
    termsWithBM25score.push([]);
    const dl = corpus[i].length;
    for (d = 0; d < corpus[i].length; d++) {
      const token = corpus[i][d];
      const tf = calculateAccurences(corpus[i], token);
      const DF = calculateDF(corpus, token);
      const tokenBM25score = calculateBM25score(tf, k, b, dl, adl, N, DF);
      if (listOfTokens.includes(token)) {
        continue;
      } else {
        termsWithBM25score[i].push([token, tokenBM25score]);
        listOfTokens.push(token);
      }
    }
  }
  return termsWithBM25score;
};

const calculateAccurences = (document, token) => {
  const phrequency = document.reduce(
    (phrequency, t) => (t === token ? phrequency + 1 : phrequency),
    0
  );
  return phrequency;
};

const calculateDF = (corpus, token) => {
  const phrequency = corpus.reduce(
    (phrequency, document) =>
      document.includes(token) ? phrequency + 1 : phrequency,
    0
  );
  return phrequency;
};
module.exports = getTokebBM25scoreArray;
