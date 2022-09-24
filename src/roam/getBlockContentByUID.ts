export async function getBlockContentByUID(
  uid,
  withChildren = false,
  withParents = false
) {
  try {
    let q = `[:find (pull ?page
               [:node/title :block/string :block/uid :block/heading :block/props 
                :entity/attrs :block/open :block/text-align :children/view-type
                :block/order
                ${withChildren ? "{:block/children ...}" : ""}
                ${withParents ? "{:block/parents ...}" : ""}
               ])
            :where [?page :block/uid "${uid}"]  ]`;
    var results = await window.roamAlphaAPI.q(q);
    if (results.length === 0) {
      return null;
    }
    return results[0][0].string;
  } catch (e) {
    return null;
  }
}
