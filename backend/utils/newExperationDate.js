const newExperationDate = () => {
  return new Date().toISOString(Date.now() + 604800000)
}

module.exports  = {
  newExperationDate
}
