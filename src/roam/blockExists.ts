export function blockExists(uid) {
  return (
    window.roamAlphaAPI.q(`[
  :find (?block ...)
  :where [?block :block/uid "${uid}"]
]`).length > 0
  );
}
