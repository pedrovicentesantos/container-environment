const TopRatedTvShowsUsecase = require('_usecases/top-rated-tv-shows');
const TvShowRepository = require('_adapters/mongodb-tv-show-repository');
const { toApplicationList } = require('./translators/tv-show-translator');

const tvShowsFound = ctx => tvShows => {
  ctx.status = 200;
  ctx.body = tvShows;
};

const TopRatedTvShows = ({ mongoDb }) => {
  const tvShowRepository = TvShowRepository({ mongoDb });
  const usecase = TopRatedTvShowsUsecase({ tvShowRepository });

  const topRated = ctx =>
    usecase
      .topRated(parseInt(ctx.query?.top) || 5)
      .then(toApplicationList)
      .then(tvShowsFound(ctx));

  return {
    topRated,
  };
};

module.exports = TopRatedTvShows;
