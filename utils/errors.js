const ERROR_CODE_400 = 400; // Bad Request (Invalid data or ID)
const UNAUTHORIZED_ERROR_CODE = 401
const FORBIDDEN_ERROR_CODE = 403
const ERROR_CODE_404 = 404; // Not Found (Document or route doesn't exist)
const ERROR_CODE_500 = 500; // Default Server Error
const ERROR_CODE_409 = 409; // Duplicate Email

module.exports = {
  ERROR_CODE_400,
  UNAUTHORIZED_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  ERROR_CODE_404,
  ERROR_CODE_409,
  ERROR_CODE_500,
};
