const Router = require('koa-router');
const validator = require('koa-async-validator');

// Middlewares
const error = require('./middlewares/error');
const validate = require('./middlewares/request-validation');
// const customValidators = require('./models/validators');
const schemas = require('./models/request-schemas');

// Application
const CreateTvShow = require('./create-tv-show');
const LikeTvShow = require('./like-tv-show');
const TopLikedTvShows = require('./top-liked-tv-shows');

const routes = infrastructure => {
  const router = new Router();

  router.use(error);
  router.use(validator());

  const createTvShow = new CreateTvShow(infrastructure);
  const likeTvShow = new LikeTvShow(infrastructure);
  const topLikedTvShows = new TopLikedTvShows(infrastructure);

  router.post('/tv-shows', validate(schemas.createTvShow), createTvShow.create);
  router.put('/tv-shows/:id/likes', validate(schemas.likeTvShow), likeTvShow.execute);
  router.get('/tv-shows', topLikedTvShows.execute);

  return router;
};

module.exports = routes;
