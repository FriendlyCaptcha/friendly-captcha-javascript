import { RiskIntelligenceData } from "./riskIntelligenceData";
import type { APIErrorCode } from "./errors.js";

/**
 * The request we make to the Friendly Captcha API to retrieve risk intelligence data for a token.
 * @internal
 */
export interface RiskIntelligenceRetrieveRequest {
  /**
   * The token that you want to retrieve risk intelligence for.
   */
  token: string;

  /**
   * Optional: the sitekey that you want to make sure the risk intelligence token was generated from.
   */
  sitekey?: string;
}

/**
 * The response we get from the Friendly Captcha API when we retrieve risk intelligence data for a token.
 * @public
 */
export interface RiskIntelligenceRetrieveResponseData {
  event_id: string;

  /**
   * Metadata about the token used for retrieval.
   */
  token: RiskIntelligenceTokenData;

  /**
   * RiskIntelligence contains risk information extracted from the provided token.
   */
  risk_intelligence: RiskIntelligenceData;
}

/**
 * The token data included in the risk intelligence retrieve response.
 * @public
 */
export interface RiskIntelligenceTokenData {
  /** Timestamp when the token was generated (RFC3339). */
  timestamp: string;
  /** Timestamp when the token expires (RFC3339). */
  expires_at: string;
  /** Number of times the token has been used. */
  num_uses: number;
  /** The origin of the site where the token was generated. */
  origin: string;
}

/**
 * @public
 */
export interface RiskIntelligenceRetrieveSuccessResponse {
  success: true;
  data: RiskIntelligenceRetrieveResponseData;
}

/**
 * @public
 */
export interface RiskIntelligenceRetrieveErrorResponseErrorData {
  error_code: APIErrorCode;
  detail: string;
}

/**
 * @public
 */
export interface RiskIntelligenceRetrieveErrorResponse {
  success: false;
  error: RiskIntelligenceRetrieveErrorResponseErrorData;
}

/**
 * @public
 */
export type RiskIntelligenceRetrieveResponse =
  | RiskIntelligenceRetrieveSuccessResponse
  | RiskIntelligenceRetrieveErrorResponse;
