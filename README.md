## Feature

When Roam Research receives one message, it automatically returns a previously random note:

![CleanShot 2022-02-18 at 16 14 15@2x](https://user-images.githubusercontent.com/4997466/154659939-d7dffa1b-4c14-465c-923b-ea3c50888e29.png)


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
- Serendipity Page:: [[TODO]]
- Trusted Media Proxy:: https://wsrv.nl/?url=
- Latest Update ID::
```
5. Make a block with the text `{{[[roam/js]]}}`.
6. Add a nested **CHILD** block `/JavaScript Code Block` with this code...
```js
var existing = document.getElementById("telegroam");
if (!existing) {
  var extension = document.createElement("script");
  extension.src = "https://telegroam.vercel.app/main.js";
  extension.id = "telegroam";
  extension.async = true;
  extension.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(extension);
}
```
7. Press the BIG RED button to enable the script and refresh the page.

![](docs/images/settings.png)

## Q&A

1. How to get your Telegram chat id? 

option 1: https://t.me/getmyid_bot

> This TG bot will send you your telegram user ID, current chat ID and sender ID or chat ID of forwarded message.

<img width="433" alt="20220408-Telegram-001263@2x" src="https://user-images.githubusercontent.com/4997466/162418605-6ccf0780-b183-4cda-8b9b-1b71dc4bad82.png">

option 2: if you are FE dev, just open the Chrome DevTool, as you can see

![](docs/images/chat-id.png)

2. How to select the block content that Bot is replying to?

Just change the `[[TODO]]` in `Serendipity Page:: [[TODO]]` to your own tag, such as `[[ZK]]` or `[[Zettel]]`
