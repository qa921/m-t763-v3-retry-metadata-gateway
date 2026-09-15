export function encodeRecord(record) { return JSON.stringify({ state: record.state, payload: record.payload, result: record.result }); }
export function decodeRecord(text) { return JSON.parse(text); }
