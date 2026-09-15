export function recordSent(store, key, payload) { store.set(key, { state: 'sent', payload }); }
export function recordCompleted(store, key, result) { store.set(key, { state: 'completed', result }); }
export function recover(store, key) {
  const record = store.get(key);
  if (record?.state === 'completed') return { action: 'replay', result: record.result };
  if (record?.state === 'sent') return { action: 'fence' };
  return { action: 'invoke' };
}
