const R = require('ramda');
const { TvShow } = require('_domain/tv-show');

/**
 * @param {Object} tvShow
 * @param {String} tvShow.title
 * @param {String} tvShow.description
 * @param {Number} tvShow.rating
 */
const toDomainModel = ({ title, description, rating }) =>
  TvShow({ title, description, rating });

const toApplication = ({ id, title, description, rating, likes: { amount } }) => ({
  id,
  title,
  description,
  rating,
  likes: amount,
});

const toApplicationList = R.map(toApplication);

module.exports = {
  toDomainModel,
  toApplication,
  toApplicationList,
};
