export const trainsType = {
    td: {
        type: "Diário",
        time: 20,
        points: {
            min: 1,
            max: 8
        },
        ryo: 200,
        doublePoints: 30,
        abv: "td"
    },
    ts: {
        type: "Semanal",
        time: 60,
        points: {
            min: 10,
            max: 15
        },
        ryo: 500,
        doublePoints: 30,
        abv: "ts"
    },
    tq: {
        type: "Quinzenal",
        time: 60,
        points: {
            min: 20,
            max: 30
        },
        ryo: 750,
        doublePoints: 30,
        abv: "tq"
    },
    tm: {
        type: "Mensal",
        time: 360,
        points: {
            min: 30,
            max: 50
        },
        ryo: 1000,
        doublePoints: 30,
        abv: "tm"
    },
    tc: {
        type: "de Chakra",
        time: 45,
        points: {
            min: 10,
            max: 50
        },
        ryo: 500,
        doublePoints: 30,
        abv: "tc"
    },
}