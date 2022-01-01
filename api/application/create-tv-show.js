const CreateTvShowUsecase = require('_usecases/create-tv-show');
const TvShowRepository = require('_adapters/mongodb-tv-show-repository');
const { toDomainModel, toApplication } = require('./translators/tv-show-translator');

const tvShowCreated = ctx => tvShow => {
  ctx.status = 201;
  ctx.body = tvShow;
};

const CreateTvShow = ({ mongoDb }) => {
  const tvShowRepository = TvShowRepository({ mongoDb });
  const createTvShowUsecase = CreateTvShowUsecase({ tvShowRepository });

  const create = ctx => {
    const tvShow = toDomainModel(ctx.request.body);
    return createTvShowUsecase
      .create(tvShow)
      .then(toApplication)
      .then(tvShowCreated(ctx));
  };

  return {
    create,
  };
};

module.exports = CreateTvShow;
