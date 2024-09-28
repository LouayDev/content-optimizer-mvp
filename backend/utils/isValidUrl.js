const isValidURL = (string) => {
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  return regex.test(string);
};

module.exports = { isValidURL };
