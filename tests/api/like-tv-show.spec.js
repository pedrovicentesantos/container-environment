const sinon = require('sinon');
const faker = require('faker');
const { v4: uuid } = require('uuid');
const createTestApi = require('_tests/helpers/server');
const mongoClient = require('_infrastructure/mongodb');
const { cleanDataBase } = require('_tests/helpers/utils');

describe('PUT /tv-shows/:id/likes endpoint test', () => {
  let sandbox, testApi;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testApi = await createTestApi();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('When sending an id of a tv show that it is not on database', () => {
    it('should respond with status 404', async () => {
      const response = await testApi
        .put(`/api/tv-shows/${uuid()}/likes`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Not found');
      expect(response.body.error).to.equal('NOT_FOUND');
    });
  });

  context('When sending an invalid id', () => {
    it('should respond with status 404', async () => {
      const response = await testApi
        .put('/api/tv-shows/invalid_id/likes');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Invalid request parameters');
      expect(response.body.error).to.equal('INVALID_REQUEST');
    });
  });

  context('When sending an existing id', () => {
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

    it('should respond with updated tv show', async () => {
      const id = uuid();
      const savedTvShow = {
        _id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        rating: faker.datatype.number({ min: 1, max: 10, precision: 0.1 }),
        likes: { amount: 1 },
      };
      await mongoDb.collection('tvShow').insertOne(savedTvShow);

      const response = await testApi
        .put(`/api/tv-shows/${id}/likes`);

      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(id);
      expect(response.body.likes).to.equal(2);
    });
  });
});
