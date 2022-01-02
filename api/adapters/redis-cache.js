const Cache = ({ redis }) => {
  const put = (key, value, expirationInSeconds = 0) =>
    expirationInSeconds
      ? redis.set(key, value, 'EX', expirationInSeconds)
      : redis.set(key, value);

  const get = key =>
    redis.get(key);

  return {
    put,
    get,
  };
};

module.exports = Cache;
