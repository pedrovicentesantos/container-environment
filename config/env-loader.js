const path = require('path');

const DEV_ENVIRONMENTS = ['dev', 'development', 'local', 'debug'];
const TEST_ENVIRONMENTS = ['test', 'testing'];
const PRODUCTION_ENVIRONMENTS = ['prod', 'production'];

const includeIgnoresCases = (list, value) =>
  list.some(val =>
    Boolean(value) && val.toUpperCase() === value.toUpperCase()
  );

const loadDotEnv = nodeEnv => {
  const dotenv = require('dotenv');

  if (includeIgnoresCases(DEV_ENVIRONMENTS, nodeEnv)) {
    return dotenv.config({
      path: path.join(__dirname, 'environments', 'dev.env'),
    });
  }

  if (includeIgnoresCases(TEST_ENVIRONMENTS, nodeEnv)) {
    return dotenv.config({
      path: path.join(__dirname, 'environments', 'test.env'),
    });
  }
}

const load = nodeEnv => {
  if (PRODUCTION_ENVIRONMENTS.includes(nodeEnv)) {
    return;
  }
  loadDotEnv(nodeEnv);
}

module.exports = {
  load,
}
