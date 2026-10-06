import { randomInt } from "crypto";

const name = 'x';
const description = `Inicia uma tentativa de ADE (ataque/defesa/esquiva).\n/ac [buff/debuff]`;
async function execute(client, message, args, userAccount, userDB) {
    const buff_debuff = args[0] ?? 0
    let probMin = 25

    if (buff_debuff && (isNaN(buff_debuff) || buff_debuff < -20 || buff_debuff > 20)) {
        return message.reply(`*ERRO:* O valor de buff/debuff deve ser um número entre -20 e +20, caso seja necessário o seu uso.`)
    }

    if (buff_debuff > 0) {
        probMin -= buff_debuff;
    } 
    else if (buff_debuff < 0) {
        probMin += Math.abs(buff_debuff);
    }

    probMin -= userAccount.ficha1.cla === "Hyuuga" ? 3 : userAccount.ficha1.cla === "Kaminarimon" ? 4 : 0

    let numberRandom = randomInt(50)

    if (numberRandom >= probMin) {
        message.reply(`Tentativa de Ataque de ${userAccount.ficha1.nome}\n\n*🍀 Chance Mínima de Acerto:* ${probMin}/50\n*🎲 Número Sorteado:* ${numberRandom}\n*📊 Resultado:* Sucesso ✅\n*💪🏻 Buffs/Debuffs:* ${buff_debuff}`)
    }
    else {
        message.reply(`Tentativa de Ataque de ${userAccount.ficha1.nome}\n\n*🍀 Chance Mínima de Acerto:* ${probMin}/50\n*🎲 Número Sorteado:* ${numberRandom}\n*📊 Resultado:* Fracasso ❌\n*💪🏻 Buffs/Debuffs:* ${buff_debuff}`)
    }
}

export default { name, description, execute };
