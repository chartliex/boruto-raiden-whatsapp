import dbCollections from '../system/mongodb.js';

export default async function resetWeather(client, message) {
    const { userDB } = await dbCollections();
    try {
        const key = process.env.HGBRASIL_API_KEY;
        if (!key) throw new Error('A variável de ambiente HGBRASIL_API_KEY não foi definida.');
        const citiesValue = [
            {name: "Rio de Janeiro", country: "País do Fogo", emoji: "🔥"},
            {name: "Santa Isabel do Rio Negro", country: "País do Relâmpago", emoji: "⚡"},
            {name: "Curitiba", country: "País da Terra", emoji: "🪨"},
            {name: "Corumbá", country: "País do Vento", emoji: "🌪️"},
            {name: "Pelotas", country: "País da Água", emoji: "🌊"},
            {name: "Vargem", country: `Vila Oculta da Chuva`, emoji: "⛈️"},
            {name: "Penedo", country: `Mundo Livre`, emoji: "🗺️"}
        ]
    
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + 6 * 60 * 60 * 1000);
        const formattedCurrentDate = currentDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        const formattedFutureDate = futureDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

        let weatherMessage = `*Previsão do Tempo*\n*Início:* ${formattedCurrentDate}\n*Fim:*${formattedFutureDate}\n horário do jogo é o mesmo do fuso horário de Brasília. A temperatura e o clima dos países são idênticos aos de estados brasileiros para manter um jogo mais realista e divertido.`;

        for (const [index, city] of citiesValue.entries()) {
            const params = new URLSearchParams({ key, city_name: city.name });
            const response = await fetch(`https://api.hgbrasil.com/weather?${params}`);
            if (!response.ok) throw new Error(`Weather API returned ${response.status}`);
            const data = await response.json();
            weatherMessage += `- *${city.emoji} ${city.country}:*\n - Temperatura ${data.results.temp}°C - ${data.results.description}`;
            if (index !== citiesValue.length - 1) {
                weatherMessage += '\n';
            }
        }

        await client.sendMessage(process.env.WHATSAPP_GROUP_ID, weatherMessage);
    } 
    catch (error) {
        console.error(error);
    }
};

Bun.cron('0,6,12,18 * * *', resetWeather, { tz: 'America/Sao_Paulo' });
