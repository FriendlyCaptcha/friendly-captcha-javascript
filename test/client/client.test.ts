import test from "ava";
import { FriendlyCaptchaClient } from "../../src/client/index.js";

// More of a test pre-assertion than anything else.
test("globalThis.fetch is present", (t) => {
  t.assert(globalThis.fetch);
});

test("client without API key throws", (t) => {
  t.throws(() => {
    const client = new FriendlyCaptchaClient({} as any);
  });
});

test("client with API key does not throw", (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "test" });
  t.assert(client);
});

test("unencodable response gets rejected", async (t) => {
  const circularReference = { self: undefined as any };
  circularReference.self = circularReference;

  const client = new FriendlyCaptchaClient({ apiKey: "my-api-key" });
  const result = await client.verifyCaptchaResponse(circularReference as any);

  t.true(result.isEncodeError());
  t.false(result.isClientError());
  t.false(result.isRequestOrTimeoutError());
  t.false(result.isDecodeError());

  t.false(result.shouldAccept());
  t.true(result.shouldReject());
});

test("request failure gets accepted", async (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "my-api-key", siteverifyEndpoint: "http://localhost:9999" }); // Assumes nothing is listening on port 9999
  const result = await client.verifyCaptchaResponse("something");

  t.false(result.isEncodeError());
  t.false(result.isClientError());
  t.true(result.isRequestOrTimeoutError());
  t.false(result.isDecodeError());

  t.true(result.shouldAccept());
  t.false(result.shouldReject());
});
