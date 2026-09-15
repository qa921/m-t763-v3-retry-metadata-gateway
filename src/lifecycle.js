export function attachListener(bus, handler) { bus.on('notification', handler); return () => bus.removeAllListeners('notification'); }
export async function shutdown(client) { client.close(); }
