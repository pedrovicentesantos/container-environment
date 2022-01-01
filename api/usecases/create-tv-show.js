const create = tvShowRepository => tvShow =>
  tvShowRepository.add(tvShow);

const CreateTvShow = ({ tvShowRepository }) => ({
  /**
 * @param {TvShow} tvShowRepository
 * @returns {Promise.<TvShow>} saved tvShow
 */
  create: create(tvShowRepository),
});

module.exports = CreateTvShow;
