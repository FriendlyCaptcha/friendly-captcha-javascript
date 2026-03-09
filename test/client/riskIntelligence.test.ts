import test from "ava";
import request from "sync-request";
import { FriendlyCaptchaClient } from "../../src/client/index.js";
import { RiskIntelligenceRetrieveSuccessResponse } from "../../src/index.js";

// Tests served from the SDK test mock server
const mockServerUrl = "http://localhost:1090";

type TestCase = {
  name: string;
  token: string;

  retrieve_response: any;
  retrieve_status_code: number;

  expectation: {
    was_able_to_retrieve: boolean;
    is_valid: boolean;
    is_client_error: boolean;
  };
};

type TestCasesFile = {
  version: number;
  tests: TestCase[];
};

const casesFile: TestCasesFile = JSON.parse(
  request("GET", `${mockServerUrl}/api/v1/riskIntelligence/retrieveTests`).getBody("utf8"),
);

for (const testCase of casesFile.tests) {
  test(`risk intelligence retrieve › ${testCase.name}`, async (t) => {
    const client = new FriendlyCaptchaClient({
      apiKey: "some-api-key",
      apiEndpoint: mockServerUrl,
    });

    const result = await client.retrieveRiskIntelligence(testCase.token);

    t.is(result.wasAbleToRetrieve(), testCase.expectation.was_able_to_retrieve);
    t.is(result.isValid(), testCase.expectation.is_valid);
    t.is(result.isClientError(), testCase.expectation.is_client_error);

    if (typeof testCase.retrieve_response === "object" && testCase.retrieve_response.success) {
      t.truthy(result.getResponse());
      t.deepEqual(result.getResponse() as RiskIntelligenceRetrieveSuccessResponse, testCase.retrieve_response);
      // Check event ID matches
      t.is(
        (result.getResponse() as RiskIntelligenceRetrieveSuccessResponse).data.event_id,
        testCase.retrieve_response.data.event_id,
      );
    }
  });
}
