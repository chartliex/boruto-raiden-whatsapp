import dbCollections from '../system/mongodb.js';

export default async function resetRanking(client, message) {
    const { userDB } = await dbCollections();
    try {
        function createRankingTitle(title) {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          
            const rankingTitle = `*🏆 Ninjas mais ${title} do Boruto Raiden - (${formattedDate}) 🏆*\n`;
            const decorationLine = '─'.repeat(rankingTitle.length) + '\n';
          
            return rankingTitle + decorationLine;
        }

        const mostPowerfulNinjas = await userDB
            .find()
            .sort({ 'ficha1.atb.pontosTotais': -1 })
            .limit(10)
            .toArray();

        let ninjaRanking = createRankingTitle('poderosos (pontos totais)');
        mostPowerfulNinjas.forEach((ninja, index) => {
            ninjaRanking += `*🔥 ${index + 1}º* - ${ninja.ficha1.nome}\n`;
        });

        const richestNinjas = await userDB
            .find()
            .sort({ 'ficha1.ryo': -1 })
            .limit(10)
            .toArray();

        let ryoRanking = createRankingTitle('ricos');
        richestNinjas.forEach((ninja, index) => {
            ryoRanking += `*💰 ${index + 1}º* - ${ninja.ficha1.nome}\n`;
        });

        await client.sendMessage(process.env.WHATSAPP_GROUP_ID, `${ninjaRanking}\n\n-\n\n${ryoRanking}`);
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('0 0 * * *', resetRanking, { tz: 'America/Sao_Paulo' });
