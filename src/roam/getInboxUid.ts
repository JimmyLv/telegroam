import { uidForToday } from '../helpers/date'
import { findBotAttribute } from './dom/findBotAttribute'
import { findMaxOrder } from './findMaxOrder'

export function getInboxUid() {
  let inboxName = findBotAttribute("Inbox Name").value;

  let dailyNoteUid = uidForToday();

  let inboxUid;
  let inboxUids = window.roamAlphaAPI.q(`[
:find (?uid ...)
:where
  [?today :block/uid "${dailyNoteUid}"]
  [?today :block/children ?block]
  [?block :block/string "${inboxName}"]
  [?block :block/uid ?uid]
]`);

  if (inboxUids.length) {
    return inboxUids[0];
  } else if (inboxName) {
    inboxUid = window.roamAlphaAPI.util.generateUID();

    // put the inbox at the bottom of the daily note
    let order = findMaxOrder(dailyNoteUid) + 1;
    window.roamAlphaAPI.createBlock({
      location: { "parent-uid": dailyNoteUid, order },
      block: { uid: inboxUid, string: inboxName },
    });
  } else {
    return dailyNoteUid;
  }
}
