export async function invokeStdio(client, request) {
  // stdio supports an envelope metadata field but consumers may ignore it.
  return client.request({ method: 'tools/call', params: { name: request.tool, arguments: request.args, _meta: { retryKey: request.invocationKey } } });
}
