import { updateFromTelegramContinuously } from "./telegram/updateFromTelegramContinuously";

async function startTelegroam() {
  // We need to use the Firebase SDK, which Roam already uses, but
  // Roam uses it via Clojure or whatever, so we import the SDK
  // JavaScript ourselves from their CDN...
  if (document.querySelector("#firebase-script")) {
    okay();
  } else {
    let script = document.createElement("SCRIPT");
    script.id = "firebase-script";
    script.setAttribute(
      "src",
      "https://www.gstatic.com/firebasejs/8.4.1/firebase.js"
    );
    script.onload = okay;
    document.body.appendChild(script);
  }

  async function okay() {
    const { firebase } = window;

    if (firebase.apps.length == 0) {
      // This is Roam's Firebase configuration stuff.
      // I hope they don't change it.
      let firebaseConfig = {
        apiKey: "AIzaSyDEtDZa7Sikv7_-dFoh9N5EuEmGJqhyK9g",
        authDomain: "app.roamresearch.com",
        databaseURL: "https://firescript-577a2.firebaseio.com",
        storageBucket: "firescript-577a2.appspot.com",
      };

      firebase.initializeApp(firebaseConfig);
    }

    updateFromTelegramContinuously();
  }
}

export default startTelegroam;
