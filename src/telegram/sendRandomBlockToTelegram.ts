import { GET } from '../requests/get'
import { findBotAttribute } from '../roam/dom/findBotAttribute'
import { lastUsedGraph } from '../roam/dom/lastUsedGraph'
import { getBlockContentByUID } from '../roam/getBlockContentByUID'
import { getRandomBlock } from '../roam/getRandomBlock'
import { getRandomBlockMentioningPage } from '../roam/getRandomBlockMentioningPage'

export async function sendRandomBlockToTelegram() {
  let telegramChatId = findBotAttribute("Chat Id").value;
  let randomFromPage = findBotAttribute("Serendipity Page").value;

  if (!telegramChatId) {
    return;
  }

  let randomBlockUid;
  if (!randomFromPage) {
    randomBlockUid = await getRandomBlock();
  } else {
    randomBlockUid = await getRandomBlockMentioningPage(randomFromPage);
  }
  const randomBlockContent = await getBlockContentByUID(randomBlockUid);
  const refUrl = `roam://#/app/${lastUsedGraph}/page/${randomBlockUid}`;
  // const refUrl = `((${randomBlockUid}}))`;
  const text = encodeURIComponent(
    `${randomBlockContent} [*](${refUrl})`
  );
  await GET(
    `sendMessage?chat_id=${telegramChatId}&text=${text}&parse_mode=Markdown`
  );
}
