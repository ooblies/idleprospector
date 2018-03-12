var itemList = [];

itemList.push({
    id: "pan",
    name: "Pan",
    description: "Used for both cooking and acquiring gold! (Note: Do not eat gold)",
    image: "https://image.flaticon.com/icons/svg/229/229666.svg",
    baseCost: 10,
    level: 0,
    limit: null,
    locked: false,
    unlocks: [],
    bonus: {minimumPanning:0.01},
    bonusDescription: "Increases minimum amount of gold found while panning."
});

itemList.push({
    id: "sieve",
    name: "Sieve",
    description: "A mesh screen that you can mostly see through.",
    image: "https://image.flaticon.com/icons/svg/98/98447.svg",
    baseCost: 10,
    level: 0,
    limit: null,
    locked: false,
    unlocks: [],
    bonus: {maximumPanning:0.02},
    bonusDescription: "Increases maximum amount of gold found while panning."
});

itemList.push({
    id: "bed",
    name: "Bed",
    description: "Wooden frame with a soft top covering. Used for lying motionless while the sun is below the horizon.",
    image: "https://image.flaticon.com/icons/svg/702/702090.svg",
    baseCost: 10,
    level: 0,
    limit: 7,
    locked: false,
    unlocks: [],
    bonus: {sleepRecovery:1},
    bonusDescription: "Increases amount of health restored from sleeping."
});

itemList.push({
    id: "stove",
    name: "Stove",
    description: "Metal box used to increase the kenetic energy of items (usually foods) placed on top.",
    image: "https://image.flaticon.com/icons/svg/63/63092.svg",
    baseCost: 5,
    level: 0,
    limit: 30,
    locked: false,
    unlocks: [],
    bonus: {foodRecovery:1},
    bonusDescription: "Increases amount of health restored from eating."
});

itemList.push({
    id: "stool",
    name: "Wooden Stool",
    description: "Tripod made of wood, enables keeping your body at a 90 degree angle for prolonged sessions.",
    image: "https://image.flaticon.com/icons/svg/114/114633.svg",
    baseCost: 25,
    level: 0,
    limit: 2,
    locked: false,
    unlocks: [],
    bonus: {workCost:.5},
    bonusDescription: "Decreases health cost of manual labor, when well rested."
});

itemList.push({
    id: "horse",
    name: "Horse",
    description: "A large, single-toed mammal.",
    image: "https://image.flaticon.com/icons/svg/101/101694.svg",
    baseCost: 20,
    level: 0,
    limit: 5,
    locked: false,
    unlocks: [],
    bonus: {travelTime:1},
    bonusDescription: "Decreases travel time between locations."
});



