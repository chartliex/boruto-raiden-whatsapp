import readCommands from "./commands.js"
import dbCollections from './mongodb.js';

export default async (client, message) => {
    if (message.body.startsWith('/')) {
        const args = message.body.split(' ');
        const commandName = args.shift().substring(1);
        const commands = await readCommands()
        const { userDB } = await dbCollections();
        try {
            const userAccount = await userDB.findOne({ id_wpp: message.author ?? message.from });
            if (!userAccount && commandName !== "criar_conta" && commandName !== "code") {
                return await message.reply(`Parece que você ainda não tem uma conta criada. Por favor, crie uma conta antes de prosseguir.`);
            }
            if (!userAccount?.ficha1?.pp_ativo && commandName !== "criar_personagem" && commandName !== "criar_conta" && commandName !== "code") {
                return await message.reply(`Parece que você ainda não criou um personagem. Por favor, crie um personagem antes de prosseguir.`);
            }
            
            const command = commands.find((command) => command.name === commandName);
            if (command) {
                await command.execute(client, message, args, userAccount, userDB);
            } else {
                await message.reply(`O comando *"${commandName}"* não existe. Por favor, verifique-o e tente novamente.`);
            }
        } catch (error) {
            console.error(error);
            await message.reply(`Ocorreu um erro ao executar o comando *"${commandName}"*. Por favor, consulte a equipe STAFF.`);
        }
    }
};
