import { SiteverifyErrorCode } from "./errors";

/**
 * The request we make to the Frienldy Captcha API.
 * @internal
 */
export interface SiteverifyRequest {
  /**
   * The response value that the user submitted in the frc-captcha-response field
   */
  response: string;
  /**
   * Optional: the sitekey that you want to make sure the puzzle was generated from.
   */
  sitekey?: string;
}

/**
 * @public
 */
export interface SiteverifyResponseData {
  challenge: SiteverifyResponseChallengeData;
}

/**
 * @public
 */
export interface SiteverifyResponseChallengeData {
  /**
   * Timestamp when the captcha challenge was completed (RFC3339).
   */
  timestamp: string;
  /**
   * The origin of the site where the captcha was solved (if known, can be empty string if not known).
   */
  origin: string;
}

/**
 * @public
 */
export interface SiteverifySuccessResponse {
  success: true;
  data: SiteverifyResponseData;
}

/**
 * @public
 */
export interface SiteverifyErrorResponseErrorData {
  error_code: SiteverifyErrorCode;
  detail: string;
}

/**
 * @public
 */
export interface SiteverifyErrorResponse {
  success: false;
  error: SiteverifyErrorResponseErrorData;
}

/**
 * @public
 */
export type SiteverifyResponse = SiteverifySuccessResponse | SiteverifyErrorResponse;
