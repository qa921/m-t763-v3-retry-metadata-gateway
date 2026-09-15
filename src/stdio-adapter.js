export async function invokeStdio(client, request) {
  // WIP: retry token is put only in a local envelope and omitted after reconnect.
  return client.request({ method: 'tools/call', params: { name: request.tool, arguments: request.args, _meta: { retry_token: request.retry?.token } } });
}
