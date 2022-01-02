const LikeTvShowUsecase = require('_usecases/like-tv-show');
const TvShowRepository = require('_adapters/mongodb-tv-show-repository');
const { toApplication } = require('./translators/tv-show-translator');

const tvShowLiked = ctx => tvShow => {
  ctx.status = 200;
  ctx.body = tvShow;
};

const LikeTvShow = ({ mongoDb }) => {
  const tvShowRepository = TvShowRepository({ mongoDb });
  const likeTvShowUsecase = LikeTvShowUsecase({ tvShowRepository });

  const like = ctx =>
    likeTvShowUsecase
      .like(ctx.params.id)
      .then(toApplication)
      .then(tvShowLiked(ctx));

  return {
    like,
  };
};

module.exports = LikeTvShow;
