const like = tvShowRepository => id =>
  tvShowRepository.increment(id, 'likes.amount');

const LikeTvShow = ({ tvShowRepository }) => ({
  /**
   * @param {String} id
   * @returns {Promise.<TvShow>}
   */
  like: like(tvShowRepository),
});

module.exports = LikeTvShow;
