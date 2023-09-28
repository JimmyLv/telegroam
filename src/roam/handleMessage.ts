import { formatMessage } from "../helpers/format";
import { makeLocationBlock } from "../telegram/makeLocationBlock";
import { parseVcard } from "../telegram/parseVcard";
import { blockExists } from "./blockExists";
import { createNestedBlock } from "./createNestedBlock";
import { insertFile } from "./insertFile";
import { formatTextContent } from './mappings/formatTextContent'

export async function handleMessage(message, index, { maxOrder, inboxUid }) {
  let text = formatMessage(message.text || "");

  if (message.location) text = "#Location";
  if (message.voice) text = "#Voice";
  if (message.video || message.video_note || message.animation) text = "#Video";
  if (message.photo) text = "#Photo";
  if (message.contact) text = "#Contact";

  const chatId = message.chat.id;
  let uid = `telegram-${chatId}-${message.message_id}`;

  let parent = inboxUid;

  if (message.reply_to_message) {
    parent = [
      "telegram",
      message.reply_to_message.chat.id,
      message.reply_to_message.message_id,
    ].join("-");

    if (!blockExists(parent)) {
      // the message replied to is included in the reply
      // so we should use that
      // but for now we just make a placeholder
      createNestedBlock(inboxUid, {
        uid: parent,
        string: "[[Telegroam: placeholder for missing message]]",
      });
    }
  }

  const textContent = await formatTextContent(message, text);

  createNestedBlock(parent, {
    uid,
    order: maxOrder + index,
    // string: `[[${name}]] at ${hhmm}: ${text}  #telegroam`
    string: textContent,
  });

  let photo = (url) => `![photo](${url})`;
  let audio = (url, text?: string) => `{{[[audio]]:${url}}}${text ? `
${text}`: ""}`;
  let video = (url) => `:hiccup[:video {:controls true :src "${url}"}]`;

  if (message.sticker) {
    if (message.sticker.is_animated)
      await insertFile(uid, chatId, message.sticker.thumb.file_id, photo);
    else await insertFile(uid, chatId, message.sticker.file_id, photo);
  }

  if (message.photo) {
    let fileid = message.photo[message.photo.length - 1].file_id;
    await insertFile(uid, chatId, fileid, photo);
  }

  if (message.voice) {
    await insertFile(uid, chatId, message.voice.file_id, audio);
  }
  if (message.video) {
    await insertFile(uid, chatId, message.video.file_id, video);
  }

  if (message.video_note) {
    await insertFile(uid, chatId, message.video_note.file_id, video);
  }

  if (message.animation) {
    await insertFile(uid, chatId, message.animation.file_id, video);
  }

  if (message.document) {
    await insertFile(
      uid,
      chatId,
      message.document.file_id,
      (url) => `File:: [${message.document.file_name}](${url})`
    );
  }

  if (message.location) {
    makeLocationBlock(uid, message.location);
  }

  if (message.poll) {
    createNestedBlock(uid, {
      uid: `telegrampoll-${message.poll.id}`,
      order: 0,
      children: message.poll.options.map((option, i) => ({
        uid: `telegrampoll-${message.poll.id}-${i}`,
        order: i,
        string: option.text,
      })),
    });
  }

  if (message.contact) {
    if (!message.contact.vcard) {
      let { first_name, last_name, phone_number } = message.contact;

      let name = first_name;
      if (last_name) name += ` ${last_name}`;

      createNestedBlock(uid, {
        string: `[[${name}]]`,
        children: [
          {
            string: `Phone Number:: ${phone_number}`,
          },
        ],
      });
    }

    if (message.contact.vcard) {
      let vcard: any = parseVcard(message.contact.vcard);
      delete vcard.begin;
      delete vcard.prodid;
      delete vcard.version;
      delete vcard.end;

      if (vcard.fn) delete vcard.n;

      let translations = {
        n: "Name",
        fn: "Full Name",
        email: "Email",
        tel: "Phone Number",
        adr: "Street Address",
        bday: "Birthday",
        impp: "Social Media",
      };

      console.log(vcard);

      createNestedBlock(uid, {
        order: 0,
        string: `[[${vcard.fn[0].value.trim()}]]`,
        children: Object.keys(vcard).map((k, i) => {
          let string = (translations[k] || k) + "::";

          let single =
            vcard[k].length == 1 && typeof vcard[k][0].value == "string";

          if (single) {
            string += " " + vcard[k][0].value.trim();
          }

          return {
            order: i,
            string,
            children: !single
              ? []
              : vcard[k].map(({ value }, j) => ({
                  order: j,
                  string:
                    value instanceof Array
                      ? value.filter((x) => x.trim()).join("\n")
                      : value.trim(),
                })),
          };
        }),
      });
    }
  }
}
