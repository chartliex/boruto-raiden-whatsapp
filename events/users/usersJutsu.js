import dbCollections from '../system/mongodb.js';
const { userDB, jutsuDB } = await dbCollections();

export default async function usersJutsu(client) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            if (doc.ficha1?.estado !== "Livre" && now >= doc.ficha1?.tempo.finish && doc.ficha1?.estado === "Jutsu") {
                const jutsus = doc.ficha1.jutsus;
                const maxJutsuId = Object.keys(jutsus).reduce((maxId, id) => Math.max(maxId, Number(id)), 0);
                const newJutsuId = maxJutsuId + 1;
                const newJutsu = {
                  idJutsu: doc.ficha1.newJutsu.idJutsu,
                };
                const jutsuDesc = await jutsuDB.findOne({"idJutsu": newJutsu.idJutsu})
      
                if (jutsuDesc.rank === "E") doc.ficha1.pointsJutsus -= 1;
                if (jutsuDesc.rank === "D") doc.ficha1.pointsJutsus -= 1;
                if (jutsuDesc.rank === "C") doc.ficha1.pointsJutsus -= 1.5;
                if (jutsuDesc.rank === "B") doc.ficha1.pointsJutsus -= 2;
                if (jutsuDesc.rank === "A") doc.ficha1.pointsJutsus -= 3;
                if (jutsuDesc.rank === "S") doc.ficha1.pointsJutsus -= 4;
            
                await userDB.updateOne(
                    { "id_wpp": doc.id_wpp },
                    { $set: { 
                        'ficha1.estado': "Livre",
                        "ficha1.newJutsu.idJutsu": 0,
                        [`ficha1.jutsus.${newJutsuId.toString()}.idJutsu`]: newJutsu.idJutsu,
                        'ficha1.pointsJutsus': doc.ficha1.pointsJutsus
                        },
                    }
                );

                let jutsuResult = `O treino de aprendizagem do jutsu *${jutsuDesc.nome}* foi concluído com êxito. ✅\n\nA partir de agora, desde que não esteja em cena (saia primeiro), está autorizado a usá-lo.`

                await client.sendMessage(doc.id_wpp, jutsuResult);
            } 
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersJutsu, { tz: 'America/Sao_Paulo' });
