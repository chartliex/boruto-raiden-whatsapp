import { MongoClient, ServerApiVersion } from 'mongodb';

export default async () => {
    let userDB, jutsuDB;
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('A variável de ambiente MONGODB_URI não foi definida.');

    const mongoclient = new MongoClient(mongoUri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    try {
        await mongoclient.connect();
        const db = mongoclient.db('borutoraiden');
        userDB = db.collection('users');
        jutsuDB = db.collection('jutsus');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }

    return { userDB, jutsuDB };
};
