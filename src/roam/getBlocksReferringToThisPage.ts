export async function getBlocksReferringToThisPage(title) {
  try {
    return await window.roamAlphaAPI.q(`
      [:find (pull ?refs [:block/string :block/uid {:block/children ...}])
          :where [?refs :block/refs ?title][?title :node/title "${title}"]]`);
  } catch (e) {
    return "";
  }
}
