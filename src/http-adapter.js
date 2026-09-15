export async function invokeHttp(client, request) {
  // Aligned: both transports derive the retry identity from request.invocationKey.
  // HTTP carries it as the baseline Idempotency-Key header (the X-Retry-Token drift
  // is removed). Advisory only: this does NOT enforce exactly-once delivery or
  // downstream idempotency; downstream support is not guaranteed (issues #11, #20).
  return client.post('/tools/' + request.tool, request.args, {
    headers: { 'Idempotency-Key': request.invocationKey }
  });
}
