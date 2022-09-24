import { stripTrailingSlash, unlinkify } from "../helpers/url";
import { GET } from "../requests/get";
import { createNestedBlock } from "./createNestedBlock";
import { findBotAttribute } from "./dom/findBotAttribute";
import { graphName } from "./dom/graphName";

export async function insertFile(uid, chatId, fileid, generate) {
  let telegramApiKey = findBotAttribute("API Key").value;
  let corsProxyUrl = stripTrailingSlash(
    unlinkify(findBotAttribute("Trusted Media Proxy").value)
  );

  let photo = await GET(`getFile?chat_id=${chatId}&file_id=${fileid}`);
  let path = photo.result.file_path;
  let url = `https://api.telegram.org/file/bot${telegramApiKey}/${path}`;

  let mediauid = createNestedBlock(uid, {
    string: generate(url),
  });

  let tmpuid = createNestedBlock(mediauid, {
    string: `Uploading in progress:: ${chatId} ${fileid}`,
  });

  console.log("fetching", url, "from proxy");
  let blobResponse = await fetch(`${corsProxyUrl}/${url}`);

  let blob = await blobResponse.blob();

  let ref = window.firebase
    .storage()
    .ref()
    .child(`imgs/app/${graphName()}/${mediauid}`);

  console.log("uploading", url, "to Roam Firebase");
  let result = await ref.put(blob);
  let firebaseUrl = await ref.getDownloadURL();

  window.roamAlphaAPI.updateBlock({
    block: {
      uid: mediauid,
      string: generate(firebaseUrl),
    },
  });

  window.roamAlphaAPI.deleteBlock({
    block: {
      uid: tmpuid,
    },
  });
}
