import { stripTrailingSlash, unlinkify } from "../helpers/url";
import { GET } from "../requests/get";
import { createNestedBlock } from "./createNestedBlock";
import { findBotAttribute } from "./dom/findBotAttribute";
import { graphName } from "./dom/graphName";

export async function insertFile(uid, chatId, fileid, generate) {
  let telegramApiKey = findBotAttribute("API Key").value;
  let bibigptUrl = findBotAttribute("BibiGPT API URL").value;
  let corsProxyUrl = stripTrailingSlash(
    unlinkify(findBotAttribute("Trusted Media Proxy").value)
  );

  if (!corsProxyUrl) {
    return
  }

  let file = await GET(`getFile?chat_id=${chatId}&file_id=${fileid}`);
  let path = file.result.file_path;
  let url = `https://api.telegram.org/file/bot${telegramApiKey}/${path}`;

  let mediauid = createNestedBlock(uid, {
    string: generate(url),
  });

  let tmpuid = createNestedBlock(mediauid, {
    string: `Uploading in progress:: ${chatId} ${fileid}`,
  });

  console.log("fetching", url, "from proxy");
  const proxyFileUrl = corsProxyUrl.includes('telegroam.vercel.app') ? `https://telegroam.vercel.app/tg/file/bot${telegramApiKey}/${path}` : `${corsProxyUrl}${url}`
  let blobResponse = await fetch(proxyFileUrl);

  let blob = await blobResponse.blob();

  let ref = window.firebase
    .storage()
    .ref()
    .child(`imgs/app/${graphName()}/${mediauid}`);

  console.log("uploading", url, "to Roam Firebase");
  let result = await ref.put(blob);
  let firebaseUrl = await ref.getDownloadURL();

  let text = ''
  // is audio file
  if (bibigptUrl && path.includes('.oga')) {
    const res= await fetch(bibigptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: proxyFileUrl, includeDetail: true })
    })
    const result = await res.json()
    text = result.summary
    // console.log('========text========', result, text)
  }

  window.roamAlphaAPI.updateBlock({
    block: {
      uid: mediauid,
      string: generate(firebaseUrl, text),
    },
  });

  window.roamAlphaAPI.deleteBlock({
    block: {
      uid: tmpuid,
    },
  });
}
