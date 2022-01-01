const uuid = require('uuid');
const moment = require('moment');

/**
 * @param {Number} amount number of likes
 * @returns Like value object
 */
const Like = amount => ({
  amount,
});

/** @typedef {String} UUID */

/**
 * @param {Object} options
 * @param {UUID} options.id
 * @param {String} options.title
 * @param {String} options.description
 * @param {Number} options.rating
 * @param {Number} options.likes
 * @returns TvShow entity
 */
const TvShow = ({ id, title, description, rating, likes, createdAt }) => ({
  title,
  description,
  rating,
  likes: Like(likes || 0),
  createdAt: createdAt || moment.utc().toISOString(),
  id: id || uuid.v4(),
});

module.exports = {
  TvShow,
  Like,
};
