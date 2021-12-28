const { catalogue: errors } = require('_domain/error');
const ErrorResponse = require('_application/models/error-response');

/**
 * Table that maps error codes to their respective responses.
 *
 * @name responses
 */
const responsesTable = {
  [errors.INVALID_REQUEST]: ErrorResponse(errors.INVALID_REQUEST, 400, 'Invalid request parameters'),
  [errors.INTERNAL]: ErrorResponse(errors.INTERNAL, 500, 'Internal server error'),
  [errors.NOT_FOUND]: ErrorResponse(errors.NOT_FOUND, 404, 'Not found'),
};

const translateError = applicationError =>
  responsesTable[applicationError.code] || responsesTable[errors.INTERNAL];

module.exports = {
  responsesTable,
  translateError,
};
