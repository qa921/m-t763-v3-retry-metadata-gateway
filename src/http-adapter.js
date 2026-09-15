export async function invokeHttp(client, request) {
  // Current baseline sends the gateway key as an advisory header.
  return client.post('/tools/' + request.tool, request.args, {
    headers: { 'Idempotency-Key': request.invocationKey }
  });
}
