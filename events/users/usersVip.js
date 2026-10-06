import dbCollections from '../system/mongodb.js';
const { userDB } = await dbCollections();

export default async function usersVips() {
    try {
        const cursor = userDB.find();
        for await (const doc of cursor) {
            const now = new Date();
            if (doc.vipExit && doc.vipExit >= now) {
                await userDB.updateOne(
                    { "id_dc": doc.id_dc },
                    { $set: { 
                        "vip": false,
                        } 
                    }
                );

                let vipResult = `Prezado(a) usuário(a),

                Gostaríamos de informar que o período de 30 dias do seu benefício VIP expirou. Agradecemos sinceramente pela sua compra e esperamos que tenha aproveitado ao máximo as vantagens do nosso serviço VIP.`
                
                await client.sendMessage(doc.id_wpp, vipResult);
            }
        };
    } 
    catch (error) {
        console.error(error);
    }
}

Bun.cron('* * * * *', usersVips, { tz: 'America/Sao_Paulo' });
