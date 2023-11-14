export type SiteverifyErrorCode =
  | typeof SITEKEY_INVALID
  | typeof AUTH_INVALID
  | typeof AUTH_REQUIRED
  | typeof BAD_REQUEST
  | typeof RESPONSE_TIMEOUT
  | typeof RESPONSE_DUPLICATE
  | typeof RESPONSE_INVALID
  | typeof RESPONSE_MISSING
  | typeof INTERNAL_SERVER_ERROR;

/**
 * The API key you provided was invalid.
 *
 * HTTP status 401.
 */
export const AUTH_INVALID = "auth_invalid";
/**
 * You forgot to set the `X-API-Key` header.
 *
 * HTTP status 401.
 */
export const AUTH_REQUIRED = "auth_required";

/**
 * The sitekey in your request is invalid.
 *
 * HTTP status 400.
 */
export const SITEKEY_INVALID = "sitekey_invalid";

/**
 * Something else is wrong with your request, e.g. your request body is empty.
 */
export const BAD_REQUEST = "bad_request";
/**
 * The response has expired.
 *
 * HTTP status 200.
 */
export const RESPONSE_TIMEOUT = "response_timeout";
/**
 * The response has already been used.
 *
 * HTTP status 200.
 */
export const RESPONSE_DUPLICATE = "response_duplicate";
/**
 * The response you provided was invalid (perhaps the user tried to work around the captcha).
 *
 * HTTP status 200.
 */
export const RESPONSE_INVALID = "response_invalid";
/**
 * You forgot to add the response parameter.
 *
 * HTTP status 400.
 */
export const RESPONSE_MISSING = "response_missing";
/**
 * Something went wrong within the server. (Should never happen).
 *
 * HTTP status 500.
 */
export const INTERNAL_SERVER_ERROR = "internal_server_error";

export const ERROR_CODE_TO_STATUS: Record<SiteverifyErrorCode, number> = {
  [SITEKEY_INVALID]: 400,
  [AUTH_INVALID]: 401,
  [AUTH_REQUIRED]: 401,
  [BAD_REQUEST]: 400,
  [RESPONSE_TIMEOUT]: 200,
  [RESPONSE_DUPLICATE]: 200,
  [RESPONSE_INVALID]: 200,
  [RESPONSE_MISSING]: 400,
  [INTERNAL_SERVER_ERROR]: 500,
};
