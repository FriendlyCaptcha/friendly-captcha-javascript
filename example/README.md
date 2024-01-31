# Friendly Captcha Express Example

This application integrates Friendly Captcha for form submissions using Express.

### Requirements

- NPM
- Your Friendly Captcha API key and sitekey.

### Start the application

- Install dependencies

```bash
npm install
```

- Setup env variables and start the application

> NOTE: `FRC_SITEVERIFY_ENDPOINT` and `FRC_WIDGET_ENDPOINT` are optional. If not set, the default values will be used. You can also use `global` or `eu` as shorthands for both.

```bash
FRC_APIKEY=<your API key> FRC_SITEKEY=<your sitekey> FRC_SITEVERIFY_ENDPOINT=<siteverify endpoint> FRC_WIDGET_ENDPOINT=<widget endpoint> npm run start
```

# Usage

Navigate to http://localhost:3000/ in your browser.
Fill out the form and submit. The Friendly Captcha verification will protect the form from bots.
