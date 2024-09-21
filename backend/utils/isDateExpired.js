const isDateExpired = (isoDateString) => {
  const expirationDate = new Date(isoDateString);
  const currentDate = new Date();
  return expirationDate < currentDate;
};

module.exports = isDateExpired;
