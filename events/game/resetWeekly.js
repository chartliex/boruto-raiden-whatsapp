import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function resetWeekly(client, message) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            let incrementoRyo = 0;
            if (doc.ficha1.pp_ativo) {
                incrementoRyo = doc.ficha1.patenteNvl * 1000;
            }
            if (doc.staff > 0) {
                incrementoRyo += 2500;
            }
            
            await userDB.updateOne(
                { "id_dc": doc.id_dc },
                { 
                $set: { 
                    'ficha1.ts': false,
                    'ficha1.tc.estado': false,
                    'ficha1.pointsJutsus': 6,
                    'ficha1.td': false,
                    'ficha1.ms.estado': false,
                },
                $inc: {
                    'ficha1.ryo': incrementoRyo
                }
                }
            );
        }
        await client.sendMessage(process.env.WHATSAPP_GROUP_ID, `Treino semanal e de chakra foi resetado para todos os personagens. Acesso liberado ao /treino s e /treino c\nRedefinido para 6 pontos de jutsus para todos os personagens.\n\nSalário pago para todos os:\n*Genin/Nukenin Rank D:* 1.000 ryou\n*Chuunin/Nukenin Rank C:* 2.000 ryou\n*Jounin/Nukenin Rank B:* 3.000 ryou\n*Jounin de Elite/Nukenin Rank A:* 4.000 ryou\n*Jounin Hanchou/Nukenin Rank S:* 5.000 ryou\n\n*Adicionais*\n*Staff:* +2.500 ryou.`);
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('0 0 * * 0', resetWeekly, { tz: 'America/Sao_Paulo' });
