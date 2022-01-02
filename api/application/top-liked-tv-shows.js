const TopLikedTvShowsUsecase = require('_usecases/top-liked-tv-shows');
const TvShowRepository = require('_adapters/mongodb-tv-show-repository');
const Cache = require('_adapters/redis-cache');
const { toApplicationList } = require('./translators/tv-show-translator');

const tvShowsFound = ctx => tvShows => {
  ctx.status = 200;
  ctx.body = tvShows;
};

const TopLikedTvShows = ({ mongoDb, redis }) => {
  const tvShowRepository = TvShowRepository({ mongoDb });
  const cache = Cache({ redis });
  const usecase = TopLikedTvShowsUsecase({ tvShowRepository, cache });

  const topLiked = ctx =>
    usecase
      .topLiked()
      .then(toApplicationList)
      .then(tvShowsFound(ctx));

  return {
    topLiked,
  };
};

module.exports = TopLikedTvShows;
