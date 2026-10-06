import dbCollections from '../system/mongodb.js';

export default async function resetDaily(client, message) {
    const { userDB } = await dbCollections();
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            await userDB.updateOne(
                { "id_wpp": doc.id_wpp },
                { $set: { 
                    'ficha1.td': false,
                    'ficha1.ms.estado': false,
                    } 
                }
            );
        }
        await client.sendMessage(process.env.WHATSAPP_GROUP_ID, `Treinos e missões diárias foram resetadas para todos os personagens. Acesso liberado ao /treino d e /ms.`);
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('0 0 * * *', resetDaily, { tz: 'America/Sao_Paulo' });
