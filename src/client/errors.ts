/**
 * Failed to encode the captcha response. This means the captcha response was invalid and should never be accepted.
 *
 * @public
 */
export const FAILED_TO_ENCODE_ERROR_CODE = "failed_to_encode_request";
/**
 *
 * The request couldn't be made, perhaps there is a network outage, DNS issue, or the API is unreachable.
 *
 * @public
 */
export const REQUEST_FAILED_ERROR_CODE = "request_failed";
/**
 *
 * The request couldn't be made, perhaps there is a network outage, DNS issue, or the API is unreachable.
 *
 * @public
 */
export const REQUEST_FAILED_TIMEOUT_ERROR_CODE = "request_failed_due_to_timeout";
/**
 * An error occured on the client side that could've been prevented. This generally means your configuration is wrong.
 *
 * Check your API key and sitekey.
 * @public
 */
export const FAILED_DUE_TO_CLIENT_ERROR_CODE = "request_failed_due_to_client_error";
/**
 * The response from the Friendly Captcha API could not be decoded.
 *
 * @public
 */
export const FAILED_TO_DECODE_RESPONSE_ERROR_CODE = "verification_response_could_not_be_decoded";
/**
 * @public
 */
export type VerifyClientErrorCode =
  | typeof FAILED_TO_ENCODE_ERROR_CODE
  | typeof REQUEST_FAILED_ERROR_CODE
  | typeof REQUEST_FAILED_TIMEOUT_ERROR_CODE
  | typeof FAILED_DUE_TO_CLIENT_ERROR_CODE
  | typeof FAILED_TO_DECODE_RESPONSE_ERROR_CODE;
