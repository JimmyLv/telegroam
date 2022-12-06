import { sleep } from "../helpers/sleep";
import { findBotAttribute } from "../roam/dom/findBotAttribute";
import { graphName } from "../roam/dom/graphName";
import { updateFromTelegram } from "../roam/updateFromTelegram";

function hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

async function hashString(string) {
  let hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(string)
  );

  return hex(hash).substr(0, 16);
}

const lockStatus = {
  ok: 200,
  busy: 423,
};

let currentLockPath;

export async function runWithMutualExclusionLock({ waitSeconds, action }) {
  let telegramApiKey = findBotAttribute("API Key").value;
  let lockId = await hashString([graphName(), telegramApiKey].join(":"));

  let nonce = window.roamAlphaAPI.util.generateUID();

  const lockDomain = `https://roam-binary-semaphore.herokuapp.com`
  let lockPath = `${lockDomain}/lock/${lockId}/${nonce}`

  let acquirePath = `${lockPath}`
  let releasePath = `${lockPath}`

  for (;;) {
    let result =
      await fetch(acquirePath, { method: "PUT" })

    if (result.status === lockStatus.ok) {
      currentLockPath = lockPath

      try {
        return await action()
      } finally {
        console.log("telegroam: releasing lock")
        currentLockPath = null
        try {
          await fetch(releasePath, { method: "DELETE" })
        } catch (e) {
          console.error(e)
          throw e
        }
      }

    } else if (result.status === lockStatus.busy) {
      console.log(`telegroam: lock busy; waiting ${waitSeconds}s`)
      await sleep(waitSeconds)
    }
  }
}

export async function updateFromTelegramContinuously() {
  for (;;) {
    try {
      let result = await runWithMutualExclusionLock({
        waitSeconds: 30,
        action: async () => {
          console.log("telegroam: lock acquired; fetching messages");
          return await updateFromTelegram();
        },
      });
    } catch (e) {
      console.error(e);
      console.log("telegroam: ignoring error; retrying in 30s");
      if (currentLockPath) {
        console.log("telegroam: releasing lock via beacon");
        navigator.sendBeacon(currentLockPath + "/release");
      }
      await sleep(30);
    }
  }
}
