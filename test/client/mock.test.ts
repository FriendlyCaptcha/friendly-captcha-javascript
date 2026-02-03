import test from "ava";
import request from "sync-request";
import { FriendlyCaptchaClient } from "../../src/client/index.js";
import { SiteverifySuccessResponse } from "../../src/index.js";

// Tests served from the SDK test mock server
const mockServerUrl = "http://localhost:1090";

type TestCase = {
  name: string;
  response: string;
  strict: boolean;

  siteverify_response: any;
  siteverify_status_code: number;

  expectation: {
    should_accept: boolean;
    was_able_to_verify: boolean;
    is_client_error: boolean;
  };
};

type TestCasesFile = {
  version: number;
  tests: TestCase[];
};

const casesFile: TestCasesFile = JSON.parse(request("GET", `${mockServerUrl}/api/v1/tests`).getBody("utf8"));

for (const testCase of casesFile.tests) {
  test(testCase.name, async (t) => {
    const client = new FriendlyCaptchaClient({
      apiKey: "some-api-key",
      siteverifyEndpoint: `${mockServerUrl}/api/v2/captcha/siteverify`,
      strict: testCase.strict,
    });

    const result = await client.verifyCaptchaResponse(testCase.response);

    t.is(result.shouldAccept(), testCase.expectation.should_accept);
    t.is(result.wasAbleToVerify(), testCase.expectation.was_able_to_verify);
    t.is(result.isClientError(), testCase.expectation.is_client_error);

    if (testCase.siteverify_response.success) {
      t.truthy(result.getResponse());
      t.deepEqual(result.getResponse() as SiteverifySuccessResponse, testCase.siteverify_response);
      // Check event ID matches
      t.is((result.getResponse() as SiteverifySuccessResponse).data.event_id, testCase.siteverify_response.data.event_id);
    }
  });
}
