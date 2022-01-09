## Installation

1. In Telegram, talk to [@BotFather](https://t.me/botfather) to create a new bot and get an API key for it.
2. Send something to your bot in a private message.
3. Make a page in your Roam called [[Telegram Bot]].
4. Paste these nodes somewhere on the [[Telegram Bot]] page:

- Inbox Name:: [[Inbox]]
- API Key:: insert key you get from Telegram's bot system
  - {{[[TODO]]}} update the Telegram API key above
- Chat Id::
- Serendipity Page:: [[Z]]
- Trusted Media Proxy:: https://telegram-cors-proxy.herokuapp.com
- Latest Update ID::

5. Make a block with the text {{[[roam/js]]}}.
6. Nested in that block, make a JavaScript code block and paste the full contents of [telegroam.js](./src/telegroam.js) inside.
7. Refresh the Roam Research website.

![](docs/images/settings.png)

## Q&A

1. How to get your Telegram chat id? open the Chrome DevTool, you can see

![](docs/images/chat-id.png)
