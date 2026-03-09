# friendly-captcha-javascript

[![NPM Version badge](https://img.shields.io/npm/v/%40friendlycaptcha/server-sdk)](https://www.npmjs.com/package/@friendlycaptcha/server-sdk)

A Javascript client for the [Friendly Captcha](https://friendlycaptcha.com) service. This client allows for easy integration and verification of captcha responses with the Friendly Captcha API.

> This library is for [Friendly Captcha v2](https://developer.friendlycaptcha.com) only. If you are looking for V1, look [here](https://docs.friendlycaptcha.com)

**This is the library you use in your backend code**. For the code that you use in your frontend, see [@friendlycaptcha/sdk](https://github.com/FriendlyCaptcha/friendly-captcha-sdk).

## Installation

**Install using [NPM](https://npmjs.com/)**

```shell
npm install @friendlycaptcha/server-sdk
```

## Usage

Below are some basic examples of how to use the client.

For a more detailed example, take a look at the [example](./example) directory.

### Initialization

```javascript
import { FriendlyCaptchaClient } from "@friendlycaptcha/server-sdk";

const frcClient = new FriendlyCaptchaClient({
  apiKey: "YOUR_API_KEY",
  sitekey: "YOUR_SITEKEY",
});
```

### Verifying a Captcha Response

After calling `verifyCaptchaResponse` with the captcha response there are two functions on the result object that you should check:

- `wasAbleToVerify()` indicates whether we were able to verify the captcha response. This will be `false` in case there was an issue with the network/our service or if there was a mistake in the configuration.
- `shouldAccept()` indicates whether the captcha response was correct. If the client is running in non-strict mode (default) and `wasAbleToVerify()` returned `false`, this will be `true`.

Below are some examples of this behaviour.

#### Verifying a correct captcha response without issues when veryfing:

```javascript
const result = await frcClient.verifyCaptchaResponse("CORRECT_CAPTCHA_RESPONSE_HERE");
console.log(result.wasAbleToVerify()); // true
console.log(result.shouldAccept()); // true
```

#### Verifying an incorrect captcha response without issues when veryfing:

```javascript
const result = await frcClient.verifyCaptchaResponse("INCORRECT_CAPTCHA_RESPONSE_HERE");
console.log(result.wasAbleToVerify()); // true
console.log(result.shouldAccept()); // false
```

#### Verifying an incorrect captcha response with issues (network issues or bad configuration) when veryfing in non-strict mode (default):

```javascript
const result = await frcClient.verifyCaptchaResponse("INCORRECT_CAPTCHA_RESPONSE_HERE");
console.log(result.wasAbleToVerify()); // false
console.log(result.shouldAccept()); // true
```

#### Verifying an incorrect captcha response with issues (network/service issues or bad configuration) when veryfing in strict mode:

```javascript
const frcClient = new FriendlyCaptchaClient({
  ...
  strict: true,
});

const result = await frcClient.verifyCaptchaResponse("INCORRECT_CAPTCHA_RESPONSE_HERE");
console.log(result.wasAbleToVerify()); // false
console.log(result.shouldAccept()); // false
```

### Retrieving Risk Intelligence

You can retrieve risk intelligence data for a given token. This provides detailed information about the risk profile of a request, including network data, geolocation, browser details, and risk scores.

```javascript
const result = await frcClient.retrieveRiskIntelligence("RISK_INTELLIGENCE_TOKEN_HERE");

// Check if we were able to retrieve the risk intelligence data
if (result.wasAbleToRetrieve()) {
  // Check if the token is valid and data was retrieved successfully
  if (result.isValid()) {
    const response = result.getResponse();
    console.log("Risk Intelligence Data:", response.data);
    
    // Access risk scores
    console.log("Overall Risk Score:", response.data.risk_intelligence.risk_scores?.overall);
    console.log("Network Risk Score:", response.data.risk_intelligence.risk_scores?.network);
    console.log("Browser Risk Score:", response.data.risk_intelligence.risk_scores.browser);
    
    // Access network information
    console.log("IP Address:", response.data.risk_intelligence.network?.ip);
    console.log("Country:", response.data.risk_intelligence.network?.geolocation.country.name);
    
    // Access browser/client information
    if (response.data.risk_intelligence.client.browser) {
      console.log("Browser:", response.data.risk_intelligence.client.browser.name);
    }
  } else {
    // Token was invalid or expired
    const error = result.getResponseError();
    console.log("Error:", error?.error_code, error?.detail);
  }
} else {
  // Network issue or configuration problem
  if (result.isClientError()) {
    console.log("Configuration error - check your API key");
  } else {
    console.log("Network issue or service temporarily unavailable");
  }
}
```

### Configuration

### Configuration

The client offers several configuration options:

- **apiKey**: Your Friendly Captcha API key.
- **sitekey**: Your Friendly Captcha sitekey.
- **strict**: (Optional) In case the client was not able to verify the captcha response at all (for example if there is a network failure or a mistake in configuration), by default `verifyCaptchaResponse` returns `true` regardless. By passing `strict: true`, it will return `false` instead: every response needs to be strictly verified.
- **apiEndpoint**: (Optional) The endpoint domain for the site verification API. Shorthands `eu` or `global` are also accepted. Default is `global`.
- **fetch**: (Optional) The fetch implementation to use. Defaults to `globalThis.fetch`.

## Development

### Install dependencies

```shell
npm install
```

### Run the tests

First run the SDK Test server, then run `npm test`.

```shell
docker run -p 1090:1090 friendlycaptcha/sdk-testserver:latest

npm test
```

### Build for production

```shell
npm run build:dist
```

## License

Open source under [MIT](./LICENSE).
