import { getBlocksReferringToThisPage } from "./getBlocksReferringToThisPage";

export async function getRandomBlockMentioningPage(pageTitle) {
  const pageTitles = pageTitle.split(",");
  const randomPage = pageTitles[Math.floor(Math.random() * pageTitles.length)];
  const page_title =
    randomPage.startsWith("[[") && randomPage.endsWith("]]")
      ? randomPage.slice(2, -2)
      : randomPage;

  var results = await getBlocksReferringToThisPage(page_title);
  if (results.length === 0) {
    return "";
  }

  var random_result = results[Math.floor(Math.random() * results.length)];
  return random_result[0].uid;
}
