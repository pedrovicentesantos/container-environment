const { fetch } = require('_api/commons');

const TopRatedTvShows = ({ tvShowRepository }) => {
  const topRated = limit =>
    fetch(tvShowRepository, 'rating', limit);

  return {
    topRated,
  };
};

module.exports = TopRatedTvShows;
