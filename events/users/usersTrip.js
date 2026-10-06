import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function usersTrip(client) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            if (doc.ficha1?.estado !== "Livre" && now >= doc.ficha1?.tempo.finish && doc.ficha1?.estado === "Viagem") {
                await userDB.updateOne(
                    { "id_wpp": doc.id_wpp },
                    { $set: { 
                        'ficha1.estado': "Livre",
                        'ficha1.local': doc.ficha1.nextLocal,
                        "ficha1.nextLocal": ""
                        },
                    }
                );

                let travelResult = `Sua viagem terminou, você chegou em *${doc.ficha1.nextLocal}* com sucesso! ✅`

                await client.sendMessage(doc.id_wpp, travelResult);  
            } 
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersTrip, { tz: 'America/Sao_Paulo' });
