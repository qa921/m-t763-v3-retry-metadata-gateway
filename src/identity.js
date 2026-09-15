export function canonicalArgs(args) { return JSON.stringify(args); }
export function invocationKey({ connectionId, tool, args }) {
  return `${connectionId}:${tool}:${canonicalArgs(args)}`;
}
