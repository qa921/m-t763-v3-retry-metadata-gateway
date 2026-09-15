// Focused regression coverage for the retry-metadata alignment fixes.
// Style matches test/recovery.spec.js (test/expect globals).
// Scope note: these tests assert advisory metadata propagation, fencing and
// lifecycle behavior only. They do NOT assert exactly-once delivery or
// downstream idempotency, which are not guaranteed (issues #11, #20).
import { invokeHttp } from '../src/http-adapter.js';
import { invokeStdio } from '../src/stdio-adapter.js';
import { reconnectAndRetry } from '../src/reconnect.js';
import { attachListener, shutdown } from '../src/lifecycle.js';
import { invocationKey } from '../src/identity.js';

test('HTTP and stdio propagate the same retry identity (issues #2, #9, #12)', async () => {
  const args = { q: 'alpha', page: 1 };
  const key = invocationKey({ connectionId: 'conn-a', tool: 'search', args });
  const req = { tool: 'search', args, invocationKey: key };

  let httpCall;
  const httpClient = { post: (path, body, opts) => { httpCall = { path, body, opts }; return Promise.resolve({}); } };
  await invokeHttp(httpClient, req);
  expect(httpCall.opts.headers['Idempotency-Key']).toBe(key);
  expect('X-Retry-Token' in httpCall.opts.headers).toBe(false);

  let stdioCall;
  const stdioClient = { request: (envelope) => { stdioCall = envelope; return Promise.resolve({}); } };
  await invokeStdio(stdioClient, req);
  expect(stdioCall.params._meta.retry_token).toBe(key);
});

test("reconnect fences ambiguous 'sent' operations and only dispatches 'new' (issues #3, #4)", async () => {
  let invokes = 0;
  let reconnects = 0;
  const client = { reconnect: () => { reconnects += 1; return Promise.resolve(); }, invoke: () => { invokes += 1; return Promise.resolve({}); } };

  let fenced = false;
  try { await reconnectAndRetry(client, { tool: 'write', state: 'sent' }); } catch (e) { fenced = true; }
  expect(fenced).toBe(true);
  expect(invokes).toBe(0);
  expect(reconnects).toBe(1);

  await reconnectAndRetry(client, { tool: 'write', state: 'new' });
  expect(invokes).toBe(1);
});

test('listener cleanup removes only its own handler (issue #13)', () => {
  const handlers = new Set();
  const bus = {
    on: (evt, h) => handlers.add(h),
    off: (evt, h) => handlers.delete(h),
    removeAllListeners: () => handlers.clear()
  };
  const unrelated = () => {};
  bus.on('notification', unrelated);
  const detach = attachListener(bus, () => {});
  expect(handlers.size).toBe(2);
  detach();
  expect(handlers.size).toBe(1);
  expect(handlers.has(unrelated)).toBe(true);
});

test('shutdown awaits client close before resolving (issue #15)', async () => {
  let closed = false;
  const client = { close: () => new Promise((resolve) => setTimeout(() => { closed = true; resolve(); }, 10)) };
  await shutdown(client);
  expect(closed).toBe(true);
});
