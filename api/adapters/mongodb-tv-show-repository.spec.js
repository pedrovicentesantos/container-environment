const R = require('ramda');
const faker = require('faker');
const uuid = require('uuid');
const Repository = require('./mongodb-tv-show-repository');
const mongoClient = require('_infrastructure/mongodb');
const { TvShow } = require('_domain/tv-show');
const { catalogue: { NOT_FOUND }, ApplicationError } = require('_domain/error');
const { cleanDataBase } = require('_tests/helpers/utils');

describe('mongodb-tv-show-repository test', () => {
  let mongoDb;

  before(async () => {
    mongoDb = await mongoClient.connect();
  });
  afterEach(() =>
    cleanDataBase(mongoDb)
  );
  after(() =>
    mongoClient.close()
  );

  describe('#add test', () => {
    context('When given a tv show', () => {
      it('should insert it into the database', async () => {
        const repository = Repository({ mongoDb });
        const tvShow = TvShow({
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          rating: faker.datatype.number({ min: 1, max: 10 }),
        });

        const result = await repository.add(tvShow);

        expect(result.id).to.equal(tvShow.id);
        const savedTvShow = await mongoDb.collection('tvShow').findOne({ _id: tvShow.id });
        expect(savedTvShow).to.not.be.null;
        expect(savedTvShow).to.not.be.undefined;
      });
    });
  });
  describe('#increment test', () => {
    context('When tv show with matching id is not found', () => {
      it('should reject with not found error', async () => {
        const repository = Repository({ mongoDb });
        const id = uuid.v4();

        const promise = repository.increment(id, 'likes.amount');

        await expect(promise)
          .to.eventually.be.rejectedWith(ApplicationError)
          .with.property('code', NOT_FOUND);
      });
    });
    context('When document with matching id is found', () => {
      it('should increment the field by 1', async () => {
        const repository = Repository({ mongoDb });
        const currentFieldValue = faker.datatype.number({
          min: 1,
          max: 100,
          precision: 1,
        });
        const id = uuid.v4();
        const savedTvShow = {
          _id: id,
          some: { random: { field: currentFieldValue } },
        };
        await mongoDb.collection('tvShow').insertOne(savedTvShow);

        const result = await repository.increment(id, 'some.random.field');

        expect(result.some.random.field).to.equal(currentFieldValue + 1);
        const updatedDocument = await mongoDb.collection('tvShow').findOne({ _id: id });
        expect(updatedDocument.some.random.field).to.equal(currentFieldValue + 1);
      });
    });
  });
  describe('#orderBy test', () => {
    const randomInt = (min, max) => faker.datatype.number({
      min,
      max,
      precision: 1,
    });
    const createTvShow = () => TvShow({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      rating: randomInt(1, 10),
      likes: randomInt(1, 200),
    });
    const createTvShows = R.pipe(
      R.times(createTvShow),
      R.uniqBy(R.path(['likes', 'amount']))
    );

    const insertTvShows = (repository, tvShows) =>
      mongoDb
        .collection('tvShow')
        .insertMany(R.map(repository.encodeTvShow, tvShows));

    const ascending = (fieldPath, limit) => R.pipe(
      R.sort(R.ascend(R.path(fieldPath))),
      R.take(limit)
    );
    const descending = (fieldPath, limit) => R.pipe(
      R.sort(R.descend(R.path(fieldPath))),
      R.take(limit)
    );
    context('When ascending is true', () => {
      it('should sort documents by field ascending and limits the result', async () => {
        const repository = Repository({ mongoDb });
        const totalDocuments = randomInt(10, 20);
        const limit = Math.floor(totalDocuments / 2);
        const registeredTvShows = createTvShows(totalDocuments);
        const expectedTvShows = ascending(['likes', 'amount'], limit)(registeredTvShows);
        await insertTvShows(repository, registeredTvShows);

        const result = await repository.orderBy('likes.amount', limit, true);

        expect(result).to.deep.equal(expectedTvShows);
      });
    });
    context('When descending is true', () => {
      it('should sort documents by field descending and limits the result', async () => {
        const repository = Repository({ mongoDb });
        const totalDocuments = randomInt(10, 20);
        const limit = Math.floor(totalDocuments / 2);
        const registeredTvShows = createTvShows(totalDocuments);
        const expectedTvShows = descending(['likes', 'amount'], limit)(registeredTvShows);
        await insertTvShows(repository, registeredTvShows);

        const result = await repository.orderBy('likes.amount', limit);

        expect(result).to.deep.equal(expectedTvShows);
      });
    });
  });
});
