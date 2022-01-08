const createTvShow = {
  title: {
    in: 'body',
    notEmpty: true,
  },
  description: {
    in: 'body',
    notEmpty: true,
  },
  rating: {
    in: 'body',
    notEmpty: true,
  },
};

const likeTvShow = {
  id: {
    in: 'params',
    notEmpty: true,
    isUUID: true,
  },
};

const topRatedTvShows = {
  top: {
    optional: true,
    in: 'query',
    isInt: true,
  },
};

module.exports = {
  createTvShow,
  likeTvShow,
  topRatedTvShows,
};
