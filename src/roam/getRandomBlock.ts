export async function getRandomBlock() {
  let results = await window.roamAlphaAPI.q(
    `[:find [(rand 1 ?blocks)] :where [?e :block/uid ?blocks]]`
  );
  return results[0][0];
}
