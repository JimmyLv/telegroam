## Feature

When Roam Research receives one message, it automatically returns a previously random note:

![CleanShot 2022-02-18 at 16 14 15@2x](https://user-images.githubusercontent.com/4997466/154644033-276293d5-749c-4279-8b6d-d1f0212e3bd2.png)


## Installation

1. In Telegram, talk to [@BotFather](https://t.me/botfather) to create a new bot and get an API key for it.
2. Send something to your bot in a private message.
3. Make a page in your Roam called [[Telegram Bot]].
4. Paste these nodes somewhere on the [[Telegram Bot]] page:
```md
- Inbox Name:: [[Inbox]]
- API Key:: insert key you get from Telegram's bot system
  - {{[[TODO]]}} update the Telegram API key above
- Chat Id::
- Serendipity Page:: [[Z]]
- Trusted Media Proxy:: https://telegram-cors-proxy.herokuapp.com
- Latest Update ID::
```
5. Make a block with the text `{{[[roam/js]]}}`.
6. Add a nested **CHILD** block `/JavaScript Code Block` with this code...
```js
var existing = document.getElementById("telegroam");
if (!existing) {
  var extension = document.createElement("script");
  extension.src = "https://telegroam.vercel.app/src/telegroam.js";
  extension.id = "telegroam";
  extension.async = true;
  extension.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(extension);
}
```
7. Press the BIG RED button to enable the script and refresh the page.

![](docs/images/settings.png)

## Q&A

1. How to get your Telegram chat id? open the Chrome DevTool, you can see

![](docs/images/chat-id.png)
