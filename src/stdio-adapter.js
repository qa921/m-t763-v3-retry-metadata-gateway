export async function invokeStdio(client, request) {
  // Aligned with HTTP: the same retry identity (request.invocationKey) is carried
  // in the supported stdio envelope field _meta.retry_token. Advisory only:
  // consumers may ignore _meta, so this is NOT an exactly-once or downstream
  // idempotency guarantee (issues #11, #20).
  // HELD (owner-policy, issue #14): whether to keep accepting the legacy
  // _meta.retryKey field is a compatibility decision for the owner; unchanged here.
  return client.request({ method: 'tools/call', params: { name: request.tool, arguments: request.args, _meta: { retry_token: request.invocationKey } } });
}
