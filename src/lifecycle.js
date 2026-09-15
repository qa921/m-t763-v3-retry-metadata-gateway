export function attachListener(bus, handler) { bus.on('notification', handler); return () => bus.off('notification', handler); }
export async function shutdown(client) { await client.close(); }
