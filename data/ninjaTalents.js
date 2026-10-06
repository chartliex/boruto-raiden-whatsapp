import dbCollections from '../events/system/mongodb.js'
const { userDB } = await dbCollections();

class TalentoNinja {
    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
}

export class TalentoNinjachakra extends TalentoNinja {
    constructor() {
        super("Chakra", "Bônus de Chakra");
    }

    N1(userAccount) {
        userDB.updateOne(
            { "id_dc": userAccount.id_dc },
            {
                $inc: {
                    "ficha1.atb.ck": 50,
                    "ficha1.atb.ckTemp": 50
                }
            }  
        );
    }

    N2(userAccount) {
        userDB.updateOne(
            { "id_dc": userAccount.id_dc },
            {
                $inc: {
                    "ficha1.atb.ck": 50,
                    "ficha1.atb.ckTemp": 50
                }
            }  
        );
    }

    N3(userAccount) {
        userDB.updateOne(
            { "id_dc": userAccount.id_dc },
            {
                $inc: {
                    "ficha1.atb.ck": 50,
                    "ficha1.atb.ckTemp": 50
                }
            }  
        );
    }

    N4(userAccount) {
        userDB.updateOne(
            { "id_dc": userAccount.id_dc },
            {
                $inc: {
                    "ficha1.atb.ck": 50,
                    "ficha1.atb.ckTemp": 50
                }
            }  
        );
    }

}

export class TalentoNinjavital extends TalentoNinja {
    constructor() {
        super("Vitalidade", "Aprimoramento da Vitalidade");
    }

    N1(userAccount) {
        userDB.updateOne(
            { "id_dc": userAccount.id_dc },
            {
                $inc: {
                    "ficha1.atb.ck": 40,
                    "ficha1.atb.ckTemp": 40
                }
            }  
        );
    }

    N2(userAccount) {

    }

    N3(userAccount) {

    }

    N4(userAccount) {

    }
}
