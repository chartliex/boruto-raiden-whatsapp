# Boruto Raiden WhatsApp Bot

[English](README.md) | [Português (Brasil)](README.pt-BR.md)

An unmaintained community bot for the Boruto Raiden game, built with Bun and `whatsapp-web.js`.

## Important notice

This project automates WhatsApp Web through an unofficial third-party library. Use it at your own risk. The person operating it is responsible for complying with applicable laws, WhatsApp's terms, and obtaining consent from message recipients. Unauthorized automation may result in account restrictions or suspension. Review the [WhatsApp Terms of Service](https://www.whatsapp.com/legal/terms-of-service) and consider an official WhatsApp Business Platform integration for supported automation.

This project is not affiliated with or endorsed by WhatsApp, Meta, or the Naruto/Boruto rights holders. The MIT license applies only to original code in this repository; it does not grant rights to third-party names, characters, marks, or other content.

The project is not actively maintained. Review the code and dependencies before running it. It is provided without warranty or support.

## Requirements

- Bun - 1.4.2
- A MongoDB connection string
- An HGBrasil weather API key
- A WhatsApp group ID for scheduled announcements

## Configuration

Copy `.env.example` to `.env`, replace the fictitious values, and never commit real credentials. You can also set these variables directly in your deployment environment.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `HGBRASIL_API_KEY` | HGBrasil weather API key |
| `WHATSAPP_GROUP_ID` | WhatsApp group that receives scheduled messages |
| `SUPPORT_EMAIL` | Optional support contact shown to users |

## Run locally

```sh
bun install
bun run index.js
```

Scan the QR code shown in the terminal to connect the WhatsApp account.

## Run with Docker

```sh
docker build -t boruto-raiden-whatsapp .
docker run --rm --env-file .env -v boruto-raiden-auth:/app/.wwebjs_auth boruto-raiden-whatsapp
```

The volume keeps the WhatsApp login session between container restarts.

## License

MIT. See [LICENSE](LICENSE).
