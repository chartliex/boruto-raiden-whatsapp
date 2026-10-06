import { trainsType } from "../../data/train.js";
import { raidRandom } from "../../data/raids.js";
import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function usersTrain(client) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            if (doc.ficha1?.estado !== "Livre" && now >= doc.ficha1?.tempo.finish && doc.ficha1?.estado === "Treino") {
                const train = trainsType[doc.ficha1.train];
            
                let pontos = randomInt(train.points.min, train.points.max);
                let pontosOld = pontos
                let bonus = false;
                
                if (randomInt(100) <= train.doublePoints) {
                    pontos = pontos * 2
                    bonus = true
                }

                if (doc.ficha1.train === "tc") {
                    await userDB.updateOne(
                        { "id_wpp": doc.id_wpp },
                        { $set: { 
                            'ficha1.estado': "Livre",
                            'ficha1.train': "x"
                            },
                            $inc: {
                            'ficha1.ryo': train.ryo,
                            'ficha1.atb.ck': pontos,
                            'ficha1.atb.ckTemp': pontos,
                            'ficha1.tc.nivel': 1,
                            [`ficha1.stacs.${train.abv}`]: 1,

                            }
                        }
                    );
    
                    let raidPass = await raidRandom(doc)
                    let chakraResult = `Seu Treino de Chakra foi concluído com sucesso! ✅\n\n*- Chakra:* +${pontos}\n*- Ryo:* +${train.ryo}`
                    if (bonus) chakraResult += `\n\n*Você ganhou o dobro de Chakra!*\nDe *+${pontosOld}* para *+${pontos}*\n`
                    if (raidPass) chakraResult += `${raidPass}`

                    await client.sendMessage(doc.id_wpp, chakraResult);
                }
                else {
                    await userDB.updateOne(
                        { "id_wpp": doc.id_wpp },
                        { $set: { 
                            'ficha1.estado': "Livre",
                            'ficha1.train': "x"
                            },
                            $inc: {
                            'ficha1.ryo': train.ryo,
                            'ficha1.atb.pontosLivres': pontos,
                            [`ficha1.stacs.${train.abv}`]: 1,

                            }
                        }
                    );

                    let raidPass = await raidRandom(doc)
                    let trainResult = `Seu Treino ${train.type} foi concluído com sucesso! ✅\n\n*- Pontos:* +${pontos}\n*- Ryo:* +${train.ryo}`
                    if (bonus) trainResult += `\n\n*Você ganhou o dobro de pontos!*\nDe *+${pontosOld}* para *+${pontos}*\n`
                    if (raidPass) trainResult += `${raidPass}`

                    await client.sendMessage(doc.id_wpp, trainResult);
                }
            } 
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersTrain, { tz: 'America/Sao_Paulo' });
