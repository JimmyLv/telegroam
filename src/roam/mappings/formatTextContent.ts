import { formatTime } from "../../helpers/format";
import { debug } from "../../helpers/log";
import { findBotAttribute } from "../dom/findBotAttribute";

export function formatTextContent(message, text) {
  let disabledDatePrefix = findBotAttribute("Disabled Date Prefix", true).value;

  let name = message.from ? message.from.first_name : null;
  let hhmm = formatTime(message.date);
  debug("========disabledDatePrefix========", disabledDatePrefix);
  const datePrefix = disabledDatePrefix === "true" ? "" : `${hhmm} `;

  const urlRE = new RegExp(
    "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+",
    "g"
  );
  const matched = text.match(urlRE);
  if (matched) {
    console.log("========text contains URL========", matched);
  }

  // string: `[[${name}]] at ${hhmm}: ${text}  #telegroam`
  return `${datePrefix}${text}`;
}
