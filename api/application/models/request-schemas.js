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
    isInt: true,
  },
};

const likeTvShow = {
  id: {
    in: 'params',
    notEmpty: true,
    isUUID: true,
  },
};

module.exports = {
  createTvShow,
  likeTvShow,
};
