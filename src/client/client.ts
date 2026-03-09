import type { RiskIntelligenceRetrieveRequest, SiteverifyRequest } from "../api/index.js";
import {
  FAILED_DUE_TO_CLIENT_ERROR_CODE,
  FAILED_TO_DECODE_RESPONSE_ERROR_CODE,
  FAILED_TO_ENCODE_ERROR_CODE,
  REQUEST_FAILED_ERROR_CODE,
  REQUEST_FAILED_TIMEOUT_ERROR_CODE,
  ClientErrorCode,
} from "./errors.js";
import { RiskIntelligenceRetrieveResult, VerifyResult } from "./result.js";
import { SDK_VERSION } from "./version.gen.js";

const DEFAULT_TIMEOUT = 20_000;

/**
 * Configuration options when creating a new `FriendlyCaptchaClient`.
 * @public
 */
export interface FriendlyCaptchaOptions {
  sitekey?: string;
  /**
   * Friendly Captcha API Key.
   */
  apiKey: string;

  /**
   * The API endpoint domain to use. Can be "eu", "global", or a custom domain (e.g., "https://api.example.com").
   * Do not include a path - it will be automatically appended.
   *
   * Defaults to `"global"`.
   */
  apiEndpoint?: string;

  /**
   * @deprecated Use `apiEndpoint` instead. This option will be removed in a future version.
   *
   * The endpoint to use for the API. Can be "eu", "global", or a custom URL.
   * If a full URL with a path is provided, the path will be stripped.
   *
   * Defaults to `"global"`.
   */
  siteverifyEndpoint?: string;

  /**
   * Whether to use strict mode, which rejects all captcha responses which were not strictly verified.
   *
   * This is not recommended. Defaults to `false`.
   */
  strict?: boolean;

  /**
   * The fetch implementation to use. Defaults to `globalThis.fetch`.
   */
  fetch?: typeof globalThis.fetch;
}

const GLOBAL_API_ENDPOINT = "https://global.frcapi.com";
const EU_API_ENDPOINT = "https://eu.frcapi.com";
const SITEVERIFY_PATH = "/api/v2/captcha/siteverify";
const RETRIEVE_PATH = "/api/v2/riskIntelligence/retrieve";

/**
 * A client for the Friendly Captcha API.
 * @public
 */
export class FriendlyCaptchaClient {
  private sitekey?: string;
  private apiKey: string;
  private siteverifyEndpoint: string;
  private riskIntelligenceRetrieveEndpoint: string;
  private strict: boolean;

  private fetch: typeof globalThis.fetch;

  constructor(opts: FriendlyCaptchaOptions) {
    this.sitekey = opts.sitekey;

    if (!opts.apiKey) {
      throw new Error("api key is required");
    }
    this.apiKey = opts.apiKey;

    // Determine the API endpoint domain
    let apiEndpoint = opts.apiEndpoint || opts.siteverifyEndpoint || "global";

    // Handle shorthands
    if (apiEndpoint === "global") {
      apiEndpoint = GLOBAL_API_ENDPOINT;
    } else if (apiEndpoint === "eu") {
      apiEndpoint = EU_API_ENDPOINT;
    } else {
      // Strip path from custom URLs (for backward compatibility with siteverifyEndpoint)
      try {
        const url = new URL(apiEndpoint);
        apiEndpoint = `${url.protocol}//${url.host}`;
      } catch (e) {
        // If it's not a valid URL, use as-is
      }
    }

    this.siteverifyEndpoint = apiEndpoint + SITEVERIFY_PATH;
    this.riskIntelligenceRetrieveEndpoint = apiEndpoint + RETRIEVE_PATH;

    this.strict = !!opts.strict;
    this.fetch = opts.fetch || globalThis.fetch;
  }

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Frc-Sdk": "friendly-captcha-javascript-sdk@" + SDK_VERSION,
      "X-Api-Key": this.apiKey,
    };
  }

  /**
   * Generic method to make API requests with common error handling.
   * @param endpoint - The API endpoint URL to call
   * @param requestBody - The request body object
   * @param result - The result object to populate
   * @param timeout - The timeout in milliseconds
   */
  private makeRequest<T extends { clientErrorType: ClientErrorCode | null; status: number; response: any }>(
    endpoint: string,
    requestBody: any,
    result: T,
    timeout: number,
  ): Promise<T> {
    let body: string;

    try {
      body = JSON.stringify(requestBody);
    } catch (e) {
      result.clientErrorType = FAILED_TO_ENCODE_ERROR_CODE;
      return Promise.resolve(result);
    }

    const headers = this.getHeaders();

    return new Promise((resolve) => {
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(() => {
        controller.abort();
        result.clientErrorType = REQUEST_FAILED_TIMEOUT_ERROR_CODE;
        resolve(result);
      }, timeout);

      this.fetch(endpoint, {
        method: "POST",
        headers,
        body,
        signal,
      })
        .then((response) => {
          result.status = response.status;
          if (response.status >= 400 && response.status < 500) {
            result.clientErrorType = FAILED_DUE_TO_CLIENT_ERROR_CODE;
          }
          return response.json().catch(() => {
            result.clientErrorType = FAILED_TO_DECODE_RESPONSE_ERROR_CODE;
            resolve(result);
          });
        })
        .then((json) => {
          if (typeof json !== "object" || json === null) {
            result.clientErrorType = FAILED_TO_DECODE_RESPONSE_ERROR_CODE;
            resolve(result);
            return;
          }
          result.response = json;
          resolve(result);
        })
        .catch((e) => {
          result.clientErrorType = REQUEST_FAILED_ERROR_CODE;
          resolve(result);
        });
    });
  }

  /**
   * Get the siteverify endpoint URL being used by this client.
   * @internal - For testing purposes only
   */
  public getSiteverifyEndpoint(): string {
    return this.siteverifyEndpoint;
  }

  /**
   * Verify a captcha response.
   *
   * @param response - The response token from the captcha.
   * @param opts - Optional options object:
   *   * `timeout`: The timeout in milliseconds. Defaults to 20 seconds.
   *   * `sitekey`: The sitekey to use for this request. Defaults to the sitekey passed to the constructor (if any).
   * @returns A promise that always resolves to a `VerifyResult` object, which contains the fields `shouldAccept()` and `wasAbleToVerify()`. This promise never rejects.
   */
  public verifyCaptchaResponse(
    response: string,
    opts: { timeout?: number; sitekey?: string } = {},
  ): Promise<VerifyResult> {
    const siteverifyRequest: SiteverifyRequest = {
      response,
    };
    if (this.sitekey || opts.sitekey) {
      siteverifyRequest.sitekey = this.sitekey || opts.sitekey;
    }

    const result = new VerifyResult(this.strict);
    const timeout = opts?.timeout || DEFAULT_TIMEOUT;

    return this.makeRequest(this.siteverifyEndpoint, siteverifyRequest, result, timeout);
  }

  /**
   * Retrieve risk intelligence data for a given risk intelligence token.
   * @param token - The risk intelligence token.
   * @param opts - Optional options object:
   *   * `timeout`: The timeout in milliseconds. Defaults to 20 seconds.
   *   * `sitekey`: The sitekey to use for this request. Defaults to the sitekey passed to the constructor (if any).
   * @returns A promise that resolves to a `RetrieveResult` object.
   */
  public retrieveRiskIntelligence(
    token: string,
    opts: { timeout?: number; sitekey?: string } = {},
  ): Promise<RiskIntelligenceRetrieveResult> {
    const retrieveRequest: RiskIntelligenceRetrieveRequest = {
      token,
    };

    if (this.sitekey || opts.sitekey) {
      retrieveRequest.sitekey = this.sitekey || opts.sitekey;
    }

    const result = new RiskIntelligenceRetrieveResult();
    const timeout = opts?.timeout || DEFAULT_TIMEOUT;

    return this.makeRequest(this.riskIntelligenceRetrieveEndpoint, retrieveRequest, result, timeout);
  }
}
