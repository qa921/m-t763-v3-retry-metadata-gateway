export async function reconnectAndRetry(client, request) {
  await client.reconnect();
  // This retry ignores recovery state and can resend an uncertain operation.
  return client.invoke(request);
}
