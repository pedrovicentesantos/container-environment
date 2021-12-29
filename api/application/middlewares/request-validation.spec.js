const sinon = require('sinon');
const { catalogue, ApplicationError } = require('_domain/error');
const middleware = require('./request-validation');

describe('Request validation middleware test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('When validating request against schema yields errors', () => {
    it('should reject with \'INVALID_REQUEST\' error, stopping the middleware stack', async () => {
      const schema = {};
      const check = sandbox.stub().returns();
      const validationErrors = sandbox.stub().resolves([
        { param: 'x', msg: 'a' },
        { param: 'x', msg: 'b' },
        { param: 'y', msg: 'c' },
      ]);
      const ctx = { check, validationErrors };
      const next = sandbox.stub().resolves();
      const expectedCode = catalogue.INVALID_REQUEST;
      const expectedCause = ['x: a, b', 'y: c'];

      const promise = middleware(schema)(ctx, next);

      await expect(promise)
        .to.eventually.be
        .rejectedWith(ApplicationError)
        .and.to.include.deep({
          code: expectedCode,
          cause: expectedCause,
        });
      expect(next).to.not.have.been.called;
      expect(check).to.have.been.calledOnceWith(schema);
    });
  });
  context('When there are no validation errors', () => {
    it('should continue the middleware stack', async () => {
      const schema = {};
      const check = sandbox.stub().returns();
      const validationErrors = sandbox.stub().resolves();
      const ctx = { check, validationErrors };
      const next = sandbox.stub().resolves();

      await middleware(schema)(ctx, next);

      expect(next).to.have.been.calledOnce;
      expect(check).to.have.been.calledOnceWith(schema);
    });
  });
});
