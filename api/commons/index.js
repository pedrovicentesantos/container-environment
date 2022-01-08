const R = require('ramda');

const CACHE_EXPIRATION_IN_SECONDS = 60;

const awaitAll = Promise.all.bind(Promise);

const resolve = Promise.resolve.bind(Promise);

const reject = Promise.reject.bind(Promise);

const serialize = R.unary(JSON.stringify);
const deserialize = R.unary(JSON.parse);

const deserializeCacheValue = R.ifElse(
  R.not,
  R.always([]),
  deserialize
);

const getFromCache = (cache, CACHE_KEY) => (
  cache
    .get(CACHE_KEY)
    .then(deserializeCacheValue)
);

const putInCache = (cache, CACHE_KEY, data) =>
  cache
    .put(CACHE_KEY, serialize(data), CACHE_EXPIRATION_IN_SECONDS)
    .then(R.always(data));

const fetch = (
  tvShowRepository,
  field,
  limit
) => (
  tvShowRepository
    .orderBy(field, limit)
);

module.exports = {
  awaitAll,
  resolve,
  reject,
  fetch,
  putInCache,
  getFromCache,
};
