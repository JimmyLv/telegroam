export function findBotAttribute(name, isOptional?: boolean) {
  const BOT_PAGE_NAME = "Telegram Bot";

  let x = window.roamAlphaAPI.q(`[
:find (pull ?block [:block/uid :block/string])
:where
  [?page :node/title "${BOT_PAGE_NAME}"]
  [?block :block/page ?page]
  [?block :block/refs ?ref]
  [?ref :node/title "${name}"]
  [?block :block/string ?string]
]`);

  // console.log("========findBotAttribute========", x);

  if (!x.length) {
    if (isOptional) {
      return {};
    }
    throw new Error(`attribute ${name} missing from [[${BOT_PAGE_NAME}]]`);
  }

  return {
    uid: x[0][0].uid,
    // if [[API Key]] without :: exists, and before the attribute
    value: x[0][0].string.split("::")[1]?.trim(),
  };
}
