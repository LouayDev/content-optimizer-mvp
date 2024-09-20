const newExperationDate = () => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2);
  return currentDate.toISOString();
};

module.exports = {
  newExperationDate,
};
