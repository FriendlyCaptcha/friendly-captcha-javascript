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

// Test the new apiEndpoint option
test("apiEndpoint option works with shorthand 'global'", (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "test", apiEndpoint: "global" });
  t.is(client.getSiteverifyEndpoint(), "https://global.frcapi.com/api/v2/captcha/siteverify");
});

test("apiEndpoint option works with shorthand 'eu'", (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "test", apiEndpoint: "eu" });
  t.is(client.getSiteverifyEndpoint(), "https://eu.frcapi.com/api/v2/captcha/siteverify");
});

test("apiEndpoint option works with custom domain", (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "test", apiEndpoint: "https://custom.example.com" });
  t.is(client.getSiteverifyEndpoint(), "https://custom.example.com/api/v2/captcha/siteverify");
});

// Test backward compatibility with deprecated siteverifyEndpoint
test("siteverifyEndpoint still works with shorthand 'global'", (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "test", siteverifyEndpoint: "global" });
  t.is(client.getSiteverifyEndpoint(), "https://global.frcapi.com/api/v2/captcha/siteverify");
});

test("siteverifyEndpoint still works with shorthand 'eu'", (t) => {
  const client = new FriendlyCaptchaClient({ apiKey: "test", siteverifyEndpoint: "eu" });
  t.is(client.getSiteverifyEndpoint(), "https://eu.frcapi.com/api/v2/captcha/siteverify");
});

test("siteverifyEndpoint strips path from full URL", (t) => {
  // Create a client with a full URL including path
  const client = new FriendlyCaptchaClient({ 
    apiKey: "my-api-key", 
    siteverifyEndpoint: "http://localhost:9999/some/path/here" 
  });
  
  // This should strip the path and use http://localhost:9999/api/v2/captcha/siteverify
  t.is(client.getSiteverifyEndpoint(), "http://localhost:9999/api/v2/captcha/siteverify");
});

test("siteverifyEndpoint strips path and query from full URL", (t) => {
  const client = new FriendlyCaptchaClient({ 
    apiKey: "test", 
    siteverifyEndpoint: "https://example.com/api/v1/verify?foo=bar" 
  });
  t.is(client.getSiteverifyEndpoint(), "https://example.com/api/v2/captcha/siteverify");
});

test("apiEndpoint takes precedence over siteverifyEndpoint", (t) => {
  const client = new FriendlyCaptchaClient({ 
    apiKey: "test", 
    apiEndpoint: "https://new.example.com",
    siteverifyEndpoint: "https://old.example.com"
  });
  t.is(client.getSiteverifyEndpoint(), "https://new.example.com/api/v2/captcha/siteverify");
});
