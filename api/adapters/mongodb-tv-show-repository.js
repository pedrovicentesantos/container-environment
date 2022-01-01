const R = require('ramda');
const { rejectWithApplicationError, catalogue } = require('_domain/error');

const encodeTvShow = ({ id, ...tvShow }) => ({
  ...tvShow,
  _id: id,
});

const decodeTvShow = ({ _id, ...tvShow }) => ({
  ...tvShow,
  id: _id,
});

const getInsertedDocument = R.path(['ops', 0]);

const tvShowNotFound = () =>
  rejectWithApplicationError({ code: catalogue.NOT_FOUND });

const getUpdatedDocument = R.pipe(
  R.prop('value'),
  R.when(R.not, tvShowNotFound)
);

const TvShowRepository = ({ mongoDb }) => {
  const add = tvShow =>
    mongoDb
      .collection('tvShow')
      .insertOne(encodeTvShow(tvShow))
      .then(getInsertedDocument)
      .then(decodeTvShow);

  const increment = (id, field) =>
    mongoDb
      .collection('tvShow')
      .findOneAndUpdate(
        { _id: id },
        { $inc: { [field]: 1 } },
        { returnOriginal: false }
      )
      .then(getUpdatedDocument)
      .then(decodeTvShow);

  const orderBy = (field, limit, ascending = false) =>
    mongoDb
      .collection('tvShow')
      .find()
      .limit(limit)
      .sort({ [field]: ascending ? 1 : -1 })
      .toArray()
      .then(R.map(decodeTvShow));

  return {
    add,
    increment,
    orderBy,
    encodeTvShow,
  };
};

module.exports = TvShowRepository;
