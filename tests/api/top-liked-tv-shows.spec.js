const sinon = require('sinon');
const faker = require('faker');
const { v4: uuid } = require('uuid');
const { createTestRedis, createTestApi, createTestMongoDb } = require('_tests/helpers/server');
const Cache = require('_adapters/redis-cache');

describe('GET /api/tv-shows endpoint test', () => {
  let sandbox, testApi, redis, mongoDb;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testApi = await createTestApi();
    redis = await createTestRedis();
    mongoDb = await createTestMongoDb();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('When there is no data on cache', () => {
    context('When there is no data on mongodb', () => {
      it('should respond with empty array', async () => {
        const response = await testApi
          .get('/api/tv-shows');

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([]);
      });
    });
    context('When there is data on mongodb', () => {
      it('should respond with data from mongodb', async () => {
        const id = uuid();
        const savedTvShow = {
          _id: id,
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          rating: faker.datatype.number({ min: 1, max: 10, precision: 0.1 }),
          likes: { amount: 1 },
        };
        const expectedTvShow = {
          id,
          title: savedTvShow.title,
          description: savedTvShow.description,
          rating: savedTvShow.rating,
          likes: 1,
        };
        await mongoDb.collection('tvShow').insertOne(savedTvShow);

        const response = await testApi
          .get('/api/tv-shows');

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([expectedTvShow]);
        expect(response.body.length).to.equal(1);
        expect(response.body[0].id).to.equal(id);
      });
    });
  });

  context('When there is data on cache', () => {
    it('should respond with data from cache', async () => {
      const id = uuid();
      const cache = Cache({ redis });
      const key = 'TOP_LIKED_TV_SHOWS';
      const expirationInSeconds = 60;
      const savedTvShow = {
        id,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        rating: faker.datatype.number({ min: 1, max: 10, precision: 0.1 }),
        likes: { amount: 1 },
      };
      const expectedTvShow = {
        id,
        title: savedTvShow.title,
        description: savedTvShow.description,
        rating: savedTvShow.rating,
        likes: 1,
      };
      await cache.put(key, JSON.stringify([savedTvShow]), expirationInSeconds);

      const response = await testApi
        .get('/api/tv-shows');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal([expectedTvShow]);
      expect(response.body.length).to.equal(1);
      expect(response.body[0].id).to.equal(id);
    });
  });
});
