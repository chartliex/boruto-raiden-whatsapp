import { raidRandom } from "../../data/raids.js";
import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function usersDoujutsus(client) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            const typesDojutsus = ["Ketsuryugan", "Sharingan", "Byakugan"]

            if (typesDojutsus.includes(doc.ficha1?.estado) && doc.ficha1?.estado !== "Livre" && now >= doc.ficha1?.tempo.finish) {
                let raidPass = await raidRandom(doc)
                let dojutsuResult = `Seu treino do *${doc.ficha1.estado}* foi concluído com sucesso! ✅`
                if (raidPass) dojutsuResult += `${raidPass}`
                
                await userDB.updateOne(
                    { "id_wpp": doc.id_wpp },
                    {  
                        $inc: {
                            [`ficha1.dojutsus.${doc.ficha1.estado.toLowerCase()}`]: 1,
                        },

                        $set: { 
                            'ficha1.estado': "Livre",
                        },
                    }
                );

                await client.sendMessage(doc.id_wpp, dojutsuResult);
            }
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersDoujutsus, { tz: 'America/Sao_Paulo' });
