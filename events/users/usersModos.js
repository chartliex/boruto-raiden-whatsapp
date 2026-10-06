import { raidRandom } from "../../data/raids.js";
import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function usersModos(client) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            const typesModos = [
                { nameInt: "oito_p", nameExt: "Oito Portões"},
                { nameInt: "biju", nameExt: "Modo Biju"},
                { nameInt: "eremita", nameExt: "Modo Eremita"},
            ];
            const foundObj = typesModos.find(obj => obj.nameExt === doc.ficha1?.estado);

            if (doc.ficha1?.estado !== "Livre" && now >= doc.ficha1?.tempo.finish && foundObj) {
                let raidPass = await raidRandom(doc)
                let modoResult = `Seu treino do **${doc.ficha1.estado}** foi concluído com sucesso! ✅`
                if (raidPass) modoResult += `${raidPass}`
                
                await userDB.updateOne(
                    { "id_wpp": doc.id_wpp },
                    { $set: { 
                        'ficha1.estado': "Livre",
                        },
                      $inc: {
                        [`ficha1.modos.${foundObj.nameInt}`]: 1,
                      }
                    }
                );

                await client.sendMessage(doc.id_wpp, modoResult);
            } 
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersModos, { tz: 'America/Sao_Paulo' });
