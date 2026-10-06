const name = 'code';
const description = `Verificação de criação de conta.`;
const supportEmail = process.env.SUPPORT_EMAIL;
async function execute(client, message, args, userAccount, userDB) {
    const userExists= await userDB.findOne({ phoneNumber: message.author ?? message.from });
    if (userExists) {
        let message = `*BORUTO RAIDEN*\n\nSeu código de verificação é: *${userExists.code}*\n\nPor favor, siga as regras abaixo para uma experiência segura:\n1. Nunca compartilhe o código de verificação com ninguém, inclusive a equipe STAFF.\n2. Este código irá expirar em 15 minutos e será necessário solicitar um novo.\n3. Caso não seja você quem tenha solicitado, por favor, ${supportEmail ? `entre em contato pelo email *${supportEmail}*` : 'entre em contato com a equipe administrativa'} com as informações referentes.`

        await client.sendMessage(message.author ?? message.from, message, { quotedMessageId: message.id._serialized }); 
    }
    else {
        let message = `*BORUTO RAIDEN*\n\nEste número de telefone não está cadastrado. Por favor, verifique-o em nosso site e tente novamente, seguindo o exemplo: (DD) 9XXXX-XXXX\nColocando o DDD do estado e o 9 adicional, caso este tenha.`

        await client.sendMessage(message.author ?? message.from, message, { quotedMessageId: message.id._serialized }); 
    }
}

export default { name, description, execute };
