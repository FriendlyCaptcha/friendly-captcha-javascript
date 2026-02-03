import { SiteverifyErrorCode } from "./errors";
import { RiskIntelligenceData } from "./typesRiskIntelligence";

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
  /**
   * EventID is unique for this siteverify request.
   */
  event_id: string;
  /**
   * Challenge data contains information about the captcha challenge that was completed, such as the timestamp and origin.
   */
  challenge: SiteverifyResponseChallengeData;

  /**
   * Risk intelligence data contains information about the client that completed the captcha challenge, such as the browser, operating system, and any detected automation tools or bots. This is only included if the Risk Intelligence module is enabled for your account.
   */
  risk_intelligence: RiskIntelligenceData | null;
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
