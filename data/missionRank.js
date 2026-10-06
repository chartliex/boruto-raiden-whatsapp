export const missionRanks = {
    d: {
        time: 30,
        patente: ["Genin", "Nukenin Rank D",
        "Chuunin", "Nukenin Rank C",
        "Jounin", "Nukenin Rank B",
        "Jounin de Elite", "Nukenin Rank A",
        "Jounin Hanchou", "Nukenin Rank S",],
        pontos: {
            min: 1,
            max: 4
        },
        ryo: {
            min: 100,
            max: 300,
        },
    },
    c: {
        time: 30,
        patente: ["Chuunin", "Nukenin Rank C",
        "Jounin", "Nukenin Rank B",
        "Jounin de Elite", "Nukenin Rank A",
        "Jounin Hanchou", "Nukenin Rank S"],
        pontos: {
            min: 3,
            max: 7
        },
        ryo: {
            min: 300,
            max: 500,
        },
    },
    b: {
        time: 45,
        patente: ["Jounin", "Nukenin Rank B", 
        "Jounin Hanchou", "Nukenin Rank S", 
        "Jounin de Elite", "Nukenin Rank A"],
        pontos: {
            min: 6,
            max: 10
        },
        ryo: {
            min: 500,
            max: 700,
        },
    },
    a: {
        time: 45,
        patente: ["Jounin de Elite", "Nukenin Rank A", 
        "Jounin Hanchou", "Nukenin Rank S"],
        pontos: {
            min: 9,
            max: 12
        },
        ryo: {
            min: 700,
            max: 900,
        },
    },
    s: {
        time: 45,
        patente: ["Jounin Hanchou", "Nukenin Rank S"],
        pontos: {
            min: 12,
            max: 15
        },
        ryo: {
            min: 900,
            max: 1100,
        },
    }
}