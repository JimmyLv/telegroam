import { debug } from "../helpers/log";
import { handleLiveLocationUpdate } from "../telegram/handleLiveLocationUpdate";
import { handlePollCreation } from "../telegram/handlePollCreation";
import { handleMessage } from "./handleMessage";

export async function handleTelegramUpdate(result, i, { maxOrder, inboxUid }) {
  debug("========msg update result========", result, i, { maxOrder, inboxUid });
  let { message, edited_message, poll } = result;

  if (poll) {
    handlePollCreation(poll, i, { maxOrder, inboxUid });
  }

  if (edited_message && edited_message.location) {
    handleLiveLocationUpdate(edited_message);
  }

  if (message) {
    await handleMessage(message, i, { maxOrder, inboxUid });
  }

  i++;
  return i;
}
