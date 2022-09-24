import { getBlocksReferringToThisPage } from "./getBlocksReferringToThisPage";

export async function getRandomBlockMentioningPage(pageTitle) {
  const page_title =
    pageTitle.startsWith("[[") && pageTitle.endsWith("]]")
      ? pageTitle.slice(2, -2)
      : pageTitle;

  var results = await getBlocksReferringToThisPage(page_title);
  if (results.length === 0) {
    return "";
  }

  var random_result = results[Math.floor(Math.random() * results.length)];
  return random_result[0].uid;
}
