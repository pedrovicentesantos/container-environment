const sinon = require('sinon');
const faker = require('faker');
const { createTestApi } = require('_tests/helpers/server');

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
          precision: 0.1,
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

  context('When sending a invalid tv show rating', () => {
    let expectedCause = [
      'rating: Rating must be a number bigger or equal to 0 and equal or smaller than 10',
    ];

    it('should respond with invalid request if rating is bigger than 10', async () => {
      const tvShow = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        rating: 10.1,
      };

      const response = await testApi
        .post('/api/tv-shows')
        .send(tvShow);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('INVALID_REQUEST');
      expect(response.body.message).to.equal('Invalid request parameters');
      expect(response.body.cause).to.deep.equal(expectedCause);
    });

    it('should respond with invalid request if rating is smaller than 0', async () => {
      const tvShow = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        rating: -0.1,
      };

      const response = await testApi
        .post('/api/tv-shows')
        .send(tvShow);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('INVALID_REQUEST');
      expect(response.body.message).to.equal('Invalid request parameters');
      expect(response.body.cause).to.deep.equal(expectedCause);
    });
    // Returns the same error message twice because it fails for gte and lte
    it('should respond with invalid request if rating is not a number', async () => {
      expectedCause = [
        'rating: Rating must be a number bigger or equal to 0 and equal or smaller than 10, Rating must be a number bigger or equal to 0 and equal or smaller than 10',
      ];
      const tvShow = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        rating: 'test_rating',
      };

      const response = await testApi
        .post('/api/tv-shows')
        .send(tvShow);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('INVALID_REQUEST');
      expect(response.body.message).to.equal('Invalid request parameters');
      expect(response.body.cause).to.deep.equal(expectedCause);
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
