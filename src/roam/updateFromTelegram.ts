import { GET } from "../requests/get";
import { sendRandomBlockToTelegram } from "../telegram/sendRandomBlockToTelegram";
import { findBotAttribute } from "./dom/findBotAttribute";
import { findMaxOrder } from "./findMaxOrder";
import { getInboxUid } from "./getInboxUid";
import { handleTelegramUpdate } from "./handleTelegramUpdate";

export async function updateFromTelegram() {
  let updateId = null;
  let updateIdBlock = findBotAttribute("Latest Update ID");
  if (updateIdBlock.value.match(/^\d+$/)) {
    updateId = +updateIdBlock.value + 1;
  }

  let updateResponse = await GET(`getUpdates?offset=${updateId}&timeout=60`);
  if (!updateResponse.result.length) {
    return;
  }

  let inboxUid = getInboxUid();
  let maxOrder = findMaxOrder(inboxUid);

  let i = 1;
  for (let result of updateResponse.result) {
    await handleTelegramUpdate(result, i, { maxOrder, inboxUid });
    await sendRandomBlockToTelegram();
    ++i;
  }

  // Save the latest Telegram message ID in the Roam graph.
  let lastUpdate = updateResponse.result[updateResponse.result.length - 1];
  window.roamAlphaAPI.updateBlock({
    block: {
      uid: updateIdBlock.uid,
      string: `Latest Update ID:: ${lastUpdate.update_id}`,
    },
  });
}
