import { getBlocksReferringToThisPage } from "./getBlocksReferringToThisPage";

export async function getRandomBlockMentioningPage(pageTitle) {
  const pageTitles = pageTitle.split(",");

  const mergedResults = await Promise.all(
    pageTitles.map(async (t) => {
      const title = t.startsWith("[[") && t.endsWith("]]") ? t.slice(2, -2) : t;
      return await getBlocksReferringToThisPage(title);
    })
  );

  var results = mergedResults.flat();
  if (results.length === 0) {
    return "";
  }

  var random_result = results[Math.floor(Math.random() * results.length)];
  return random_result[0].uid;
}
