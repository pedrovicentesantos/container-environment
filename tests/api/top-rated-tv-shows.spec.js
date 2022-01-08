const sinon = require('sinon');
const faker = require('faker');
const { createTestApi, createTestMongoDb } = require('_tests/helpers/server');

const generateTvShow = () => ({
  _id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  rating: faker.datatype.number({ min: 1, max: 10, precision: 0.1 }),
  likes: { amount: 1 },
});

describe('GET /api/tv-shows/top-rated endpoint test', () => {
  let sandbox, testApi, mongoDb;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testApi = await createTestApi();
    mongoDb = await createTestMongoDb();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('When there is no data on mongodb', () => {
    it('should respond with empty array', async () => {
      const response = await testApi
        .get('/api/tv-shows/top-rated');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal([]);
    });
  });

  context('When top is not sent in query params', () => {
    context('When there is data on mongodb', () => {
      it('should respond with top 5 data from mongodb', async () => {
        for (let i = 0; i < 6; i += 1) {
          await mongoDb.collection('tvShow').insertOne(generateTvShow());
        }

        const response = await testApi
          .get('/api/tv-shows/top-rated');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(5);
      });
    });
  });

  context('When top is sent in query params', () => {
    context('When there is data on mongodb', () => {
      it('should respond with top X data from mongodb', async () => {
        for (let i = 0; i < 6; i += 1) {
          await mongoDb.collection('tvShow').insertOne(generateTvShow());
        }

        const response = await testApi
          .get('/api/tv-shows/top-rated')
          .query({ top: 3 });

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
      });
    });
  });
});
