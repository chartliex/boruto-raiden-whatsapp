import dbCollections from '../system/mongodb.js';

export default async function deleteGhosts (client, message) {
    const { userDB } = await dbCollections();
    try {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
        
        const cursor = userDB.find({ lastCommand: { $lt: thirtyDaysAgo } });
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            client.sendMessage(doc.id_wpp, `Sua conta e seu personagem foram excluídas devido a inatividade por mais de 30 dias. Obrigado por jogar conosco e esperamos vê-lo novamente!`);
            await userDB.deleteOne({ _id: doc._id });
        }
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('0 0 * * *', deleteGhosts, { tz: 'America/Sao_Paulo' });
