import { lastUsedGraph } from '../roam/dom/lastUsedGraph'

const isDebug = lastUsedGraph === "Note-Tasking";
export const debug = isDebug ? console.debug : () => {};
