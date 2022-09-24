import { findBotAttribute } from "../roam/dom/findBotAttribute";

export async function GET(path) {
  let telegramApiKey = findBotAttribute("API Key").value;
  let api = `https://api.telegram.org/bot${telegramApiKey}`;

  let response = await fetch(`${api}/${path}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`telegroam fetch: ${response.status}`);
  }
}
