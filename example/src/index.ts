import express, { Request, Response } from "express";
import { FriendlyCaptchaClient } from "@friendlycaptcha/server-sdk";

type FormMessage = {
  subject: string;
  message: string;
};

const app = express();
const port = process.env.PORT || 3000;

const FRC_SITEKEY = process.env.FRC_SITEKEY;
const FRC_APIKEY = process.env.FRC_APIKEY;

// Optionally we can pass in custom endpoints to be used, such as "eu".
const FRC_API_ENDPOINT = process.env.FRC_API_ENDPOINT;
const FRC_WIDGET_ENDPOINT = process.env.FRC_WIDGET_ENDPOINT;

if (!FRC_SITEKEY || !FRC_APIKEY) {
  console.error(
    "Please set the FRC_SITEKEY and FRC_APIKEY environment values before running this example to your Friendly Captcha sitekey and API key respectively.",
  );
  process.exit(1);
}

const frcClient = new FriendlyCaptchaClient({
  apiKey: FRC_APIKEY,
  sitekey: FRC_SITEKEY,
  apiEndpoint: FRC_API_ENDPOINT, // optional, defaults to "global". Can be "eu", "global", or a custom domain
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.render("index", {
    message: "",
    sitekey: FRC_SITEKEY,
    widgetEndpoint: FRC_WIDGET_ENDPOINT,
  });
});

app.post("/", async (req: Request, res: Response) => {
  const formData = req.body;
  const formMessage = formData as FormMessage;

  const frcCaptchaResponse = formData["frc-captcha-response"];
  const result = await frcClient.verifyCaptchaResponse(frcCaptchaResponse);
  if (!result.wasAbleToVerify()) {
    // In this case we were not actually able to verify the response embedded in the form, but we may still want to accept it.
    // It could mean there is a network issue or that the service is down. In those cases you generally want to accept submissions anyhow.
    // That's why we use `shouldAccept()` below to actually accept or reject the form submission. It will return true in these cases.

    if (result.isClientError()) {
      // Something is wrong with our configuration, check your API key!
      // Send yourself an alert to fix this! Your site is unprotected until you fix this.
      console.error("CAPTCHA CONFIG ERROR: ", result.getErrorCode(), result.getResponseError());
    } else {
      console.error("Failed to verify captcha response: ", result.getErrorCode(), result.getResponseError());
    }
  }

  if (!result.shouldAccept()) {
    res.render("index", {
      message: "❌ Anti-robot check failed, please try again.",
      sitekey: FRC_SITEKEY,
      widgetEndpoint: FRC_WIDGET_ENDPOINT,
    });
    return;
  }

  // The captcha was OK, process the form.
  formMessage; // Normally we would use the form data in `formMessage` here and submit it to our database.

  res.render("index", {
    message: "✅ Your message has been submitted successfully.",
    sitekey: FRC_SITEKEY,
    widgetEndpoint: FRC_WIDGET_ENDPOINT,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
