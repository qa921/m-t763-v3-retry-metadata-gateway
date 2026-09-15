export async function invokeHttp(client, request) {
  // WIP: uses a different field than the durable identity and loses metadata on reconnect.
  const retryToken = request.retry?.token || request.invocationKey;
  return client.post('/tools/' + request.tool, request.args, {
    headers: { 'X-Retry-Token': retryToken, 'Idempotency-Key': request.invocationKey }
  });
}
