import dbCollections from '../system/mongodb.js';

export default async function resetBiweekly (client, message) {
    const { userDB } = await dbCollections();
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            await userDB.updateOne(
                { "id_wpp": doc.id_wpp },
                { $set: { 
                    'ficha1.tq': false,
                    'ficha1.vips.reset_atb': false
                    } 
                }
            );
        }
        await client.sendMessage(process.env.WHATSAPP_GROUP_ID, `Treino quinzenal foi resetado para todos os personagens. Acesso liberado ao /treino qz`);
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('0 0 1,15 * *', resetBiweekly, { tz: 'America/Sao_Paulo' });
