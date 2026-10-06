import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { MongoClient, ServerApiVersion } from 'mongodb';

let userDB;
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) throw new Error('A variável de ambiente MONGODB_URI não foi definida.');
const supportEmail = process.env.SUPPORT_EMAIL;

const mongoclient = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {
    await mongoclient.connect();
    const db = mongoclient.db('borutoraiden');
    userDB = db.collection('users');
} 
catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    },
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Boruto Raiden online no WhatsApp.');
});
 
client.initialize();

setInterval(async () => {
    const usersToNotify = await userDB.find({ passwordChange: true, notifiedPasswordChange: { $ne: true } }).toArray();
    for (let user of usersToNotify) {
        let response = `*BORUTO RAIDEN*\n\nPor favor, envie o comando /recode [senha] para alterar sua senha. Caso não seja você quem tenha solicitado, por favor, ${supportEmail ? `entre em contato pelo email *${supportEmail}*` : 'entre em contato com a equipe administrativa'}. `;
        await client.sendMessage(user.id_wpp, response);
        await userDB.updateOne({ _id: user._id }, { $set: { notifiedPasswordChange: true } });
    }
}, 5000);

client.on('message', async message => {
	if (message.body === '/code') {
        const userExists= await userDB.findOne({ phoneNumber: message.from.replace("55","").replace("@c.us","") });
        if (userExists) {
            let response = `*BORUTO RAIDEN*\n\nSeu código de verificação é: *${userExists.code}*\n\nPor favor, siga as regras abaixo para uma experiência segura:\n\n1. Nunca compartilhe o código de verificação com ninguém, inclusive a equipe STAFF.\n2. Este código irá expirar em 15 minutos e será necessário solicitar um novo.\n3. Caso não seja você quem tenha solicitado, por favor, ${supportEmail ? `entre em contato pelo email *${supportEmail}*` : 'entre em contato com a equipe administrativa'} com as informações referentes.`
    
            await message.reply(response); 
        }
        else {
            let response = `*BORUTO RAIDEN*\n\nEste número de telefone não está cadastrado. Por favor, verifique-o em nosso site e tente novamente, seguindo o exemplo: (DD) 9XXXX-XXXX\nColocando o DDD do estado e o 9 adicional, caso este tenha.`
    
            await message.reply(response); 
        }
	}

    else if (message.body.startsWith('/recode')) {
        const userExists = await userDB.findOne({ idWpp: message.from });
        if (!userExists) await message.reply("Este número de telefone não está cadastrado em nenhuma conta.");
        if (!userExists.passwordChange) await message.reply("Este número de telefone não solicitou a redefinição de senha.");
        const password = message.body.split(' ')[1];
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/;
        if (passwordRegex.test(password)) {
            await userDB.updateOne({ idWpp: message.from }, { $set: { password: await Bun.password.hash(password), passwordChange: false, notified: false } });
            let response = `*BORUTO RAIDEN*\n\nSua senha foi alterada com sucesso.`;
            await message.reply(response);
        } else {
            let response = `*BORUTO RAIDEN*\n\nA senha fornecida não é válida. Por favor, forneça uma senha que atenda aos seguintes critérios:\n- Pelo menos uma letra maiúscula\n- Pelo menos uma letra minúscula\n- Pelo menos um dígito\n- Pelo menos um caractere especial (@, $, !, %, *, ?, & ou #)\n- No mínimo 10 caracteres de comprimento`;
            await message.reply(response);
        }
    }
});
