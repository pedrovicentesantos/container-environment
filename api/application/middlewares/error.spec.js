const R = require('ramda');
const sinon = require('sinon');
const { catalogue, ApplicationError } = require('_domain/error');
const { responsesTable } = require('_application/translators/error-translator');
const { awaitAll } = require('_api/commons');
const middleware = require('./error');

const testMiddleware = async (nextError, expectedResponse) => {
  const ctx = {};
  const next = sinon.stub().rejects(nextError);

  await middleware(ctx, next);

  expect(ctx.status).to.equal(expectedResponse.status);
  expect(ctx.body).to.deep.equal(expectedResponse.body);
};

const testResponse = (code, response) =>
  testMiddleware(new ApplicationError({ code }), response);

const testAllResponses = R.pipe(
  R.toPairs,
  R.map(R.apply(testResponse)),
  awaitAll
);

describe('Error middleware test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('When middleware rejects', () => {
    it('should serialize the matching response', () =>
      testAllResponses(responsesTable)
    );

    it('should serialize the default response error', () =>
      testMiddleware(
        new Error('Test error'),
        responsesTable[catalogue.INTERNAL]
      )
    );
  });

  context('When middleware resolves', () => {
    it('should resolve without changing the response', async () => {
      const ctx = {};
      const next = sinon.stub().resolves();

      await middleware(ctx, next);

      expect(ctx).to.deep.equal({});
    });
  });
});
