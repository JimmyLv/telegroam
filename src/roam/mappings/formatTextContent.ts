import { formatTime } from "../../helpers/format";
import { debug } from "../../helpers/log";
import { findBotAttribute } from "../dom/findBotAttribute";
import { replaceAsync } from "./replaceAsync";

export async function formatTextContent(message, text) {
  let disabledDatePrefix = findBotAttribute("Disabled Date Prefix", true).value;

  let name = message.from?.first_name || message.sender_chat?.title;
  let hhmm = formatTime(message.date);
  console.info(`telegroam: ${name} sent message:`, message);

  debug("========disabledDatePrefix========", disabledDatePrefix);
  const datePrefix = disabledDatePrefix === "true" ? "" : `${hhmm} `;

  const urlRegex = new RegExp(
    /(]\()?(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/gi
  );

  const matched = text.match(urlRegex);
  if (matched) {
    console.info("telegroam: text contains URLs", matched);
    const replacedText = await replaceAsync(text, urlRegex, urlTitle);

    async function urlTitle(match: string) {
      // is markdown link
      if (match.startsWith("](")) {
        return match;
      }
      // https://github.com/mmazzarolo/url-metadata-scraper
      try {
        const res = await fetch(
          `https://url-metadata-scraper.vercel.app/api/scrape?url=${match}`
        ).then((res) => res.json());

        return res.title ? `[${res.title}](${match})` : match;
      } catch (e) {
        console.error(e);
        return match;
      }
    }
    console.info("telegroam: replaced text with Markdown links", replacedText);
    return `${datePrefix}${replacedText}`;
  }

  // string: `[[${name}]] at ${hhmm}: ${text}  #telegroam`
  return `${datePrefix}${text}`;
}
