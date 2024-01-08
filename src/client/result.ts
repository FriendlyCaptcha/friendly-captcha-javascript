import type { SiteverifyErrorResponseErrorData, SiteverifyResponse } from "../api";
import {
  FAILED_DUE_TO_CLIENT_ERROR_CODE,
  FAILED_TO_DECODE_RESPONSE_ERROR_CODE,
  FAILED_TO_ENCODE_ERROR_CODE,
  REQUEST_FAILED_ERROR_CODE,
  REQUEST_FAILED_TIMEOUT_ERROR_CODE,
  VerifyClientErrorCode,
} from "./errors.js";

/**
 * The result of a captcha siteverify request.
 * 
 * @public
 */
export class VerifyResult {

  private strict: boolean;
  /**
   * The HTTP status code of the response.  
   * `-1` if there was no response.
   */
  public status: number = -1;

  /**
   * The response from the Friendly Captcha API, or null if the request was not made at all.
   */
  public response: SiteverifyResponse | null = null;
  public clientErrorType: VerifyClientErrorCode | null = null;

  constructor(strict: boolean) {
    this.strict = strict;
  }

  /**
   * @returns Whether strict mode was enabled for this verification.
   */
  public isStrict(): boolean {
    return this.strict;
  }

  /**
   * @returns Whether the captcha should be accepted.   
   * Note that this does not necessarily mean it was verified.
   */
  public shouldAccept(): boolean {
    if (this.wasAbleToVerify()) {
      // We want to reject in case we were not able to encode the captcha response sent by the client.
      // This is because an attacker could send malformed data that can not be encoded, and if we would accept that
      // they could circumvent the captcha.
      if (this.isEncodeError()) {
        return false;
      }

      return this.response!.success === true;
    }
    if (this.clientErrorType !== null) {
      if (this.strict) {
        // In strict mode we reject on any error.
        return false;
      } else if (
        this.clientErrorType === REQUEST_FAILED_ERROR_CODE ||
        this.clientErrorType === REQUEST_FAILED_TIMEOUT_ERROR_CODE ||
        this.clientErrorType === FAILED_DUE_TO_CLIENT_ERROR_CODE ||
        this.clientErrorType === FAILED_TO_DECODE_RESPONSE_ERROR_CODE
      ) {
        // In case of failures that are not the captcha response being invalid or rejected, we accept.
        // This is because we don't want to lock out all users in case of a temporary network outage or a misconfiguration.
        return true;
      } else {
        return false;
      }
    }

    throw new Error(
      "Implementation error in @friendlycaptcha/server-sdk shouldAccept: errorCode should never be undefined if success is false. " +
        JSON.stringify(this),
    );
  }

  /**
   * @returns The reverse of `shouldAccept()`.
   */
  public shouldReject(): boolean {
    return !this.shouldAccept();
  }

  /**
   * Was unable to encode the captcha response. This means the captcha response was invalid and should never be accepted.
   */
  public isEncodeError(): boolean {
    return this.clientErrorType === FAILED_TO_ENCODE_ERROR_CODE;
  }

  /**
   * Something went wrong making the request to the Friendly Captcha API, perhaps there is a network connection issue?
   */
  public isRequestOrTimeoutError(): boolean {
    return this.clientErrorType === REQUEST_FAILED_ERROR_CODE || this.clientErrorType === REQUEST_FAILED_TIMEOUT_ERROR_CODE;
  }

  /**
   * Something went wrong decoding the response from the Friendly Captcha API.
   */
  public isDecodeError(): boolean {
    return this.clientErrorType === FAILED_TO_DECODE_RESPONSE_ERROR_CODE;
  }

  /**
   * Something went wrong on the client side, this generally means your configuration is wrong.
   * Check your secrets (API key) and sitekey.
   *
   * See `getResponseError()` for more information.
   */
  public isClientError(): boolean {
    return this.clientErrorType === FAILED_DUE_TO_CLIENT_ERROR_CODE;
  }
  /**
   * @returns The response from the Friendly Captcha API, or null if the request was not made at all.
   */
  public getResponse(): SiteverifyResponse | null {
    return this.response;
  }

  /**
   * @returns The `error` field form the response, or null if it is not present.
   */
  public getResponseError(): SiteverifyErrorResponseErrorData | null {
    if (!this.response || this.response.success) return null;
    return this.response.error;
  }

  public getErrorCode(): VerifyClientErrorCode | null {
    return this.clientErrorType;
  }

  /**
   * Whether the request to verify the captcha was completed. In other words: the API responded with status 200.'
   * If this is false, you should notify yourself and use `getErrorCode()` and `getResponseError()` to see what is wrong.
   */
  public wasAbleToVerify(): boolean {
    // If we failed to encode, we actually consider `wasAbleToVerify` to be true. This is because we don't want to 
    // alert on failed encoding: an attacker could send such malformed data that it fails to encode.
    if (this.isEncodeError()) {
      return true;
    }

    // We got a status 200, and we were able to actually make the request and decode its response.
    return this.status === 200 && !this.isRequestOrTimeoutError() && !this.isDecodeError();
  }
}
