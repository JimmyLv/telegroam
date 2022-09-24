export function formatMessage(text) {
  text = text.replace(/\bTODO\b/, "{{[[TODO]]}}");
  return text;
}

export function formatTime(unixSeconds) {
  let date = new Date(1000 * unixSeconds);
  let hhmm = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return hhmm;
}
