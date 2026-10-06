# Bot de WhatsApp do Boruto Raiden

[English](README.md) | [Português (Brasil)](README.pt-BR.md)

Bot comunitário não mantido para o jogo Boruto Raiden, feito com Bun e `whatsapp-web.js`.

## Aviso importante

Este projeto automatiza o WhatsApp Web por meio de uma biblioteca não oficial de terceiros. Use por sua conta e risco. Quem opera o bot é responsável por cumprir as leis aplicáveis e os termos do WhatsApp, além de obter consentimento de quem recebe mensagens. A automação não autorizada pode causar restrições ou suspensão da conta. Consulte os [Termos de Serviço do WhatsApp](https://www.whatsapp.com/legal/terms-of-service) e considere uma integração oficial com a Plataforma WhatsApp Business para automações compatíveis.

Este projeto não é afiliado nem endossado pelo WhatsApp, pela Meta ou pelos titulares dos direitos de Naruto/Boruto. A licença MIT cobre apenas o código original deste repositório; ela não concede direitos sobre nomes, personagens, marcas ou outros conteúdos de terceiros.

O projeto não está em manutenção ativa. Revise o código e as dependências antes de executá-lo. Ele é fornecido sem garantia ou suporte.

## Requisitos

- Bun - 1.4.2
- Uma URI de conexão com MongoDB
- Uma chave de API de clima da HGBrasil
- O ID do grupo do WhatsApp que receberá os avisos agendados

## Configuração

Copie `.env.example` para `.env`, substitua os valores fictícios e nunca envie credenciais reais ao Git. Você também pode definir essas variáveis diretamente no ambiente de execução.

| Variável | Finalidade |
| --- | --- |
| `MONGODB_URI` | URI de conexão com o MongoDB |
| `HGBRASIL_API_KEY` | Chave da API de clima da HGBrasil |
| `WHATSAPP_GROUP_ID` | Grupo que receberá as mensagens agendadas |
| `SUPPORT_EMAIL` | Contato de suporte opcional exibido aos usuários |

## Executar localmente

```sh
bun install
bun run index.js
```

Leia o QR code exibido no terminal para conectar a conta do WhatsApp.

## Executar com Docker

```sh
docker build -t boruto-raiden-whatsapp .
docker run --rm --env-file .env -v boruto-raiden-auth:/app/.wwebjs_auth boruto-raiden-whatsapp
```

O volume mantém a sessão do WhatsApp entre reinicializações do container.

## Licença

MIT. Consulte [LICENSE](LICENSE).
