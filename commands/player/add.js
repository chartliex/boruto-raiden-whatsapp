const name = 'x';
const description = `Adiciona pontos nos atributos.\n/add [atributo] [pontos]`;
async function execute(client, message, args, userAccount, userDB) {
    const attribute = args[0]
    const amount = args[1];

    if (!attribute || !amount) {
        return message.reply(`*ERRO:* O tipo de atributo e/ou a quantia estão ausentes.`)
    }

    const attributeType = ['t','n','g','dt','dn','dg']
    const attributeName = {
        t: "Taijutsu",
        n: "Ninjutsu",
        g: "Genjutsu",
        dt: "Defesa Taijutsu",
        dn: "Defesa Ninjutsu",
        dg: "Defesa Genjutsu"
    }
    if (!attribute.includes(attributeType)) {
        return message.reply(`*ERRO:* O tipo de atributo deve ser **${attributeType.join(', ')}**`)
    }

    if (isNaN(amount) || amount < 1 || amount > 10) {
        return message.reply(`*ERRO:* A quantia de atributos deve ser um número entre 1 e 10`)
    }

    const amountOld = amount

    if (amount > userAccount.ficha1.atb.pontosLivres) {
        return await message.reply(`Não é possível adicionar *${amount} ponto(s)* porque você só tem *${userAccount.ficha1.atb.pontosLivres} disponível(s)*.`);
    }

    if (userAccount.ficha1.talentos[attribute]?.n) {
        switch (userAccount.ficha1.talentos[attribute].n) {
        case 1:
            amount += amount >= 10 ? 1 : 0;
            break;
        case 2:
            amount += amount >= 10 ? 2 : 0;
            break;
        case 3:
            amount += amount >= 10 ? 3 : 0;
            break;
        case 4:
            amount += amount >= 10 ? 4 : 0;
            break;
        }
    }

    amount += attribute === "t" ? userAccount.ficha1.cla === "Darui" ? 7 : 0 : 0
    amount += attribute === "n" ? userAccount.ficha1.cla === "Iburi" ? 7 : 0 : 0
    const atbOld = userAccount.ficha1.atb[attribute]

    await userDB.updateOne(
        { "id_wpp": userAccount.id_wpp },
        { $inc: { 
            [`ficha1.atb.${attribute}`]: amount,
            [`ficha1.atb.${attribute}Temp`]: amount,
            [`ficha1.atb.pontosTotaisSemBonus`]: amountOld,
            [`ficha1.atb.pontosTotais`]: amount,
            [`ficha1.atb.pontosLivres`]: -amountOld,
            } 
        }
    );
    let slots = ['slot1', 'slot2'];
    for (let slot of slots) {
        if (userAccount.ficha1.invs[slot].nome !== "Vazio") {
            await userDB.updateOne(
                { "id_wpp": userAccount.id_wpp },
                { $inc: { 
                    [`ficha1.invs.${slot}.${attribute}`]: Math.floor(amountOld / 2),
                    [`ficha1.invs.${slot}.${attribute}Temp`]: Math.floor(amountOld / 2),
                    [`ficha1.invs.${slot}.pontosTotais`]: amountOld,
                    } 
                }
            );
        }
    }

    userAccount = await userDB.findOne({ "id_wpp": userAccount.id_wpp})

    await interaction.editReply({ content: `*O atributo "${attributeName[atb]}" aumentou!*
*${attributeName[atb]} antigo:* ${atbOld}
*${attributeName[atb]} novo:* ${userAccount.ficha1.atb[atb]}

*Pontos Livres:* ${userAccount.ficha1.atb.pontosLivres}
*Pontos Totais (Com bônus):* ${userAccount.ficha1.atb.pontosTotais}`})
}

export default { name, description, execute }