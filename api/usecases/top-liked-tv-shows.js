const R = require('ramda');
const { getFromCache, fetch, putInCache } = require('_api/commons');
const CACHE_KEY = 'TOP_LIKED_TV_SHOWS';
const limit = 5;

const TopLikedTvShows = ({ tvShowRepository, cache }) => {
  const topLiked = () =>
    getFromCache(cache, CACHE_KEY)
      .then(R.when(R.isEmpty, R.always(
        fetch(tvShowRepository, 'likes.amount', limit)
          .then(data => putInCache(cache, CACHE_KEY, data))
      )));

  return {
    topLiked,
  };
};

module.exports = TopLikedTvShows;
