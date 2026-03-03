import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from "util";

(globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;

// Expose Node.js 18+ built-in fetch APIs to the jsdom test environment
// jsdom doesn't include the Fetch API, but Node.js 18+ provides it natively
const nodeGlobal = global as typeof globalThis & {
  fetch?: typeof fetch;
  Request?: typeof Request;
  Response?: typeof Response;
  Headers?: typeof Headers;
};
if (nodeGlobal.fetch) {
  Object.assign(globalThis, {
    fetch: nodeGlobal.fetch,
    Request: nodeGlobal.Request,
    Response: nodeGlobal.Response,
    Headers: nodeGlobal.Headers,
  });
}