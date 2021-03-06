const R = require('ramda');
const { catalogue, rejectWithApplicationError } = require('_domain/error');

const joinMessages = R.pipe(
  R.map(R.prop('msg')),
  R.join(', ')
);

const buildErrorCause = R.pipe(
  R.groupBy(R.prop('param')),
  R.toPairs,
  R.map(R.evolve({ 1: joinMessages })),
  R.map(R.join(': '))
);

const handleValidationErrors = R.pipe(
  buildErrorCause,
  R.objOf('cause'),
  R.assoc('code', catalogue.INVALID_REQUEST),
  rejectWithApplicationError
);

/**
 * Creates request validation middleware that validates the request against the provided schema.
 *
 * @async
 * @name validate
 * @param {Object} schema request definition schema
 * @returns {function(Object, Function): Promise} validation middlewares: uses koa-async-validator applying the schema to the context:
 * - verifies if the are validation errors in the context
 * - throws INVALID_REQUEST error if there are
 */
const validate = schema => (ctx, next) => {
  ctx.check(schema);
  // Custom validation for rating field
  if (ctx.request?.body?.rating) {
    ctx
      .checkBody('rating', 'Rating must be a number bigger or equal to 0 and equal or smaller than 10')
      .gte(0)
      .lte(10);
  }
  // Custom validation for top query param
  if (ctx.query?.top) {
    ctx
      .checkQuery('top', 'Top must be a number bigger or equal to 1')
      .gte(1);
  }
  return ctx
    .validationErrors()
    .then(e =>
      R.ifElse(
        R.identity,
        handleValidationErrors,
        next
      )(e)
    );
};

module.exports = validate;
