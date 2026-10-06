import dbCollections from '../events/system/mongodb.js'
const { userDB } = await dbCollections();
import { randomInt } from "crypto";

export async function raidRandom(doc) {
    const raidPassRandom = randomInt(1, 101);
    const raidPassNumbers = [74];
    doc.vip && raidPassNumbers.push(41, 95, 65);
    let raidPassResult = `Empty`
    let bonusPass = false;
    if (raidPassNumbers.includes(raidPassRandom)) {
        const raidPassPorcent = randomInt(1, 101);
        const raidPassNumbers = {
            "Passe de Raid - Biju (Escolha)": [88, 3, 77],
            "Passe de Raid - Biju (Semanal)": [21, 45, 32, 89, 12, 67, 55],
            "Passe de Raid - Biju (Aleatório)": [92, 14, 51, 25, 70, 8, 36, 60, 19, 40],
            "Passe de Raid - Invocação (Escolha)": [95, 23, 18, 69, 50, 10, 86, 47],
            "Passe de Raid - Invocação (Semanal)": [49, 33, 83, 15, 57, 31, 6, 78, 22, 61, 7, 91],
            "Passe de Raid - Invocação (Aleatório)": [72, 24, 28, 29, 48, 56, 62],
            "Passe de Raid - Jutsu (Escolha)": [9, 16, 27, 42, 96,100],
            "Passe de Raid - Jutsu (Semanal)": [64 ,68 ,37 ,54 ,1 ,59 ,46 ,35 ,43 ,79 ,73 ,63 ,13],
            "Passe de Raid - Jutsu (Aleatório)": [30 ,41 ,53 ,65 ,99 ,17 ,34 ,74 ,5],
            "Passe de Raid - Item Especial (Escolha)": [81 ,82 ,98 ,84 ,85 ,87 ,58],
            "Passe de Raid - Item Especial (Semanal)": [76 ,38 ,4 ,71 ,93 ,80 ,26 ,90 ,20 ,11 ,94 ,97],
            "Passe de Raid - Item Especial (Aleatório)": [52 ,75 ,2 ,66 ,44 ,39]               
        };
        
        raidPassResult = Object.keys(raidPassNumbers).find(key => raidPassNumbers[key].includes(raidPassPorcent)) || "Empty";
    
        if (raidPassResult !== "Empty") {
            for (let i = 1; i <= 10; i++) {
                const slot = doc.ficha1.inventario[`slot${i}`];
                if (slot.nome === raidPassResult) {
                    bonusPass = true;
                    await userDB.updateOne(
                        { "id_dc": doc.id_dc },
                        { $inc: { 
                            [`ficha1.inventario.slot${i}.quantia`]: 1,
                            } 
                        }
                    );
                    return `\n**- Item Raro:** ${raidPassResult}\n\nCaso o item não apareça no seu inventário é porque ele está cheio e o bônus foi perdido. Por favor, não insista!\n\nUse Passes de Raids para obter jutsus, invocações, bijus e itens exclusivos.\nCaso não deseje o item, não é possível vender, envie o comando **/usar** e selecione o slot do item e a quantia.`
                }
            }

            if (!bonusPass) {
                for (let i = 1; i <= 10; i++) {
                    const slot = doc.ficha1.inventario[`slot${i}`];
                    if (slot.nome === "Vazio") {
                        bonusPass = true;
                        await userDB.updateOne(
                            { "id_dc": doc.id_dc },
                            { $set: { 
                                [`ficha1.inventario.slot${i}.nome`]: raidPassResult,
                                [`ficha1.inventario.slot${i}.quantia`]: 1,
                                } 
                            }
                        );
                        return `\n**- Item Raro:** ${raidPassResult}\n\nCaso o item não apareça no seu inventário é porque ele está cheio e o bônus foi perdido. Por favor, não insista!\n\nUse Passes de Raids para obter jutsus, invocações, bijus e itens exclusivos.\nCaso não deseje o item, não é possível vender, envie o comando **/usar** e selecione o slot do item e a quantia.`
                    }
                }
            }
        }
    }
    else {
        return false
    }
}
