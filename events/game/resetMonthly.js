import dbCollections from '../system/mongodb.js';

export default async function resetMonthly(client, message) {
    const { userDB } = await dbCollections();
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            await userDB.updateOne(
                { "id_wpp": doc.id_wpp },
                { $set: { 
                    'ficha1.tm': false,
                    'ficha1.trades.limit': 0
                    } 
                }
            );
        }
        await client.sendMessage(process.env.WHATSAPP_GROUP_ID, `Treino mensal foi resetado para todos os personagens. Acesso liberado ao /treino m.`);
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('2 0 1 * *', resetMonthly, { tz: 'America/Sao_Paulo' });
