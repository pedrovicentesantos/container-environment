const sinon = require('sinon');
const faker = require('faker');
const createTestApi = require('_tests/helpers/server');

describe('POST /api/tv-shows endpoint test', () => {
  let sandbox, testApi;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    testApi = await createTestApi();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('When sending a valid tv show', () => {
    it('should respond with created tv show', async () => {
      const tvShow = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        rating: faker.datatype.number({
          min: 0,
          max: 10,
        }),
      };

      const response = await testApi
        .post('/api/tv-shows')
        .send(tvShow);

      expect(response.status).to.equal(201);
      expect(response.body.title).to.equal(tvShow.title);
      expect(response.body.description).to.equal(tvShow.description);
      expect(response.body.rating).to.equal(tvShow.rating);
    });
  });

  context('When sending an empty tv show title', () => {
    it('should respond with invalid request', async () => {
      const tvShow = {
        title: '',
        description: faker.lorem.paragraph(),
        rating: faker.datatype.number({
          min: 0,
          max: 10,
        }),
      };

      const response = await testApi
        .post('/api/tv-shows')
        .send(tvShow);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('INVALID_REQUEST');
      expect(response.body.message).to.equal('Invalid request parameters');
    });
  });

  context('When sending an empty tv show description', () => {
    it('should respond with invalid request', async () => {
      const tvShow = {
        title: faker.lorem.sentence(),
        description: '',
        rating: faker.datatype.number({
          min: 0,
          max: 10,
        }),
      };

      const response = await testApi
        .post('/api/tv-shows')
        .send(tvShow);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('INVALID_REQUEST');
      expect(response.body.message).to.equal('Invalid request parameters');
    });
  });

  context('When sending an empty body', () => {
    it('should respond with invalid request', async () => {
      const body = {};

      const response = await testApi
        .post('/api/tv-shows')
        .send(body);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('INVALID_REQUEST');
      expect(response.body.message).to.equal('Invalid request parameters');
    });
  });
});
