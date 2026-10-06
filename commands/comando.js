const name = 'comando';
const description = `Descrição do comando`;
async function execute(client, message, args, userAccount, userDB) {
    client.sendMessage(message.author ?? message.from, "123", { quotedMessageId: message.id._serialized }); 
}

export default { name, description, execute };
