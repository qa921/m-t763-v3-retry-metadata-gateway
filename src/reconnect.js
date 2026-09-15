export async function reconnectAndRetry(client, request) {
  await client.reconnect();
  // Safety guard: only re-dispatch operations that were never attempted. A record
  // in 'sent' state is uncertain -- it may already have been executed -- so it is
  // NOT resent without durable completion proof (issues #3, #4).
  // This is an interim guard, NOT an exactly-once mechanism; durable replay
  // evidence is held pending the serializer/recovery design review.
  if (request.state && request.state !== 'new') {
    throw new Error('Uncertain operation state "' + request.state + '": refusing to resend without completion proof');
  }
  return client.invoke(request);
}
