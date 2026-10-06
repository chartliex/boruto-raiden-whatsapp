import { missionRanks } from "../../data/missionRank.js";
import { raidRandom } from "../../data/raids.js";
import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function usersMission(client) {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            if (doc.ficha1?.estado !== "Livre" && now >= doc.ficha1?.tempo.finish && doc.ficha1?.estado === "Missão") {
                const rank = doc.ficha1.ms.rank;
                const mission = missionRanks[rank];

                let pontos = randomInt(mission.pontos.min, mission.pontos.max);
                pontos += pontos * (doc.vip ? 0.40 : (doc.nitro ? 0.20 : 0));
                
                let ryo = randomInt(mission.ryo.min, mission.ryo.max);
                ryo += ryo * (doc.vip ? 0.40 : (doc.nitro ? 0.20 : 0));                    

                const jutsuPorcent = randomInt(1, 101)
                let parchmentJutsuRank = `Empty`
                let bonusParchment;
                parchmentJutsuRank = jutsuPorcent <= 30 ? "Pergaminho - Jutsu Rank D" :
                    jutsuPorcent <= 50 ? "Pergaminho - Jutsu Rank C" :
                    jutsuPorcent <= 60 ? "Pergaminho - Jutsu Rank B" :
                    jutsuPorcent <= 65 ? "Pergaminho - Jutsu Rank A" :
                    jutsuPorcent === 66 ? "Pergaminho - Jutsu Rank S" :
                    "Empty";

                if (parchmentJutsuRank !== "Empty") {
                    for (let i = 1; i <= 10; i++) {
                        const slot = doc.ficha1.inventario[`slot${i}`];
                        if (slot.nome === parchmentJutsuRank) {
                            bonusParchment = true;
                            await userDB.updateOne(
                                { "id_wpp": doc.id_wpp },
                                { $inc: { 
                                    [`ficha1.inventario.slot${i}.quantia`]: 1,
                                    } 
                                }
                            );
                            break;
                        }
                    }

                    if (!bonusParchment) {
                        for (let i = 1; i <= 10; i++) {
                            const slot = doc.ficha1.inventario[`slot${i}`];
                            if (slot.nome === "Vazio") {
                                bonusParchment = true;
                                await userDB.updateOne(
                                    { "id_dc": doc.id_dc },
                                    { $set: { 
                                        [`ficha1.inventario.slot${i}.nome`]: parchmentJutsuRank,
                                        [`ficha1.inventario.slot${i}.quantia`]: 1,
                                        } 
                                    }
                                );
                                break;
                            }
                        }
                    }

                }

                await userDB.updateOne(
                    { "id_wpp": doc.id_wpp },
                    { 
                        $inc: {
                            'ficha1.ryo': ryo,
                            'ficha1.atb.pontosLivres': pontos,
                            [`ficha1.stacs.missao.${rank}`]: 1
                        },
                        $set: {
                            'ficha1.estado': "Livre"
                        }
                    }
                );
                
                let raidPass = await raidRandom(doc)
                let missionResult = `Sua missão Rank ${rank.toUpperCase()} foi concluída com sucesso! ✅\n\n*- Pontos:* +${pontos}\n**- Ryo:** +${ryo}`
                if (bonusParchment) missionResult += `\n*- Item Raro:* ${parchmentJutsuRank}\n\nCaso o item não apareça no seu inventário é porque ele está cheio e o bônus foi perdido. Por favor, não insista!\n\nPergaminhos de Jutsus permitem aprender qualquer jutsu instantaneamente, desde que cumpra todos os requisitos, exceto Rank. Use o comando */pergaminho*\n\nCaso não deseje o item, não é possível vender, envie o comando */usar* e selecione o slot do item e a quantia.`
                if (raidPass) missionResult += `${raidPass}`

                await client.sendMessage(doc.id_wpp, missionResult);
            } 
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersMission, { tz: 'America/Sao_Paulo' });
