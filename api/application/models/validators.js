const customValidators = {
  gte: (param, num) => parseFloat(param) && param >= num,
  lte: (param, num) => parseFloat(param) && param <= num,
};

module.exports = customValidators;
