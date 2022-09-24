export function findMaxOrder(parent) {
  let orders = window.roamAlphaAPI.q(`[
  :find (?order ...)
  :where
    [?today :block/uid "${parent}"]
    [?today :block/children ?block]
    [?block :block/order ?order]
]`);

  let maxOrder = Math.max(-1, ...orders);
  return maxOrder;
}
