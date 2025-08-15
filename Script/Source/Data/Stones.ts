namespace Script {
    export namespace DataContent {
        export const stones: StoneData[] = [
            {
                id: "healstone",
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.HEAL, level: 1 },
                        info: "Heals a random ally for 1 health at the end of the fight."
                    },
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: SPELL_TYPE.HEAL, level: 1 },
                        info: "Heals two random allies for 1 health at the end of the fight."
                    }
                ]
            },
            {
                id: "shieldstone",
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: SPELL_TYPE.SHIELD, level: 1 },
                        info: "Gives 1 shield to the ally with the lowest health at the start of the fight."
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: SPELL_TYPE.SHIELD, level: 2 },
                        info: "Gives 2 shield to the ally with the lowest health at the start of the fight."
                    }
                ]
            },
            {
                id: "brick",
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.SHIELD, level: 1 },
                        info: "Gives 1 shield to each ally in the first row at the start of the fight."
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.SHIELD, level: 2 },
                        info: "Gives 2 shield to each ally in the first row at the start of the fight."
                    }
                ]
            },
            {
                id: "knowledgestone", //TODO - 1 / 2 additional exp points
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 },
                        info: "SHOULD give 1 xp at the end of the fight. CURRENTLY JUST 1 GOLD"
                    },
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 },
                        info: "SHOULD give 2 xp at the end of the fight. CURRENTLY JUST 1 GOLD"
                    }
                ]
            },
            {
                id: "wonderstone", // should give 1 random eumling a random buff at fight start
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: {
                            type: SPELL_TYPE.SHIELD, level: 1
                        },
                        info: "SHOULD give a random buff to a random ally at the start of the fight. CURRENTLY JUST SHIELD 1"

                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 },
                        info: "SHOULD give a random buff to two random allies at the start of the fight. CURRENTLY JUST 1 GOLD?"
                    }
                ]
            },
            {
                id: "punchstone", // Should deal 1 damage to a random enemy on fight start.
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.RANDOM }, },
                        attack: { baseDamage: 1 },
                        info: "Deals 1 damage to a random enemy at the start of the fight."
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 2, sortBy: TARGET_SORT.RANDOM }, },
                        attack: { baseDamage: 1 },
                        info: "Deals 1 damage to two random enemies at the start of the fight."
                    }
                ]
            },
            {
                id: "warningstone", // Should give 1 random enemy weakness at fight start.
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.WEAKNESS, level: 1 },
                        info: "Gives 1 weakness to a random enemy at the start of the fight."
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.STRONGEST } },
                        spell: { type: SPELL_TYPE.WEAKNESS, level: 1 },
                        info: "Gives 1 weakness to the strongest enemy at the start of the fight."
                    }
                ]
            },
            {
                id: "glitterstone", //TODO - should reward 1 / 2 gold at the end of combat
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 },
                        info: "Gives 1 gold at the end of combat."
                    },
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 2 },
                        info: "Gives 2 gold at the end of combat."
                    }
                ]
            },
            {
                id: "pointystone", // Should give all Eumlinge in the last row thorns
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 1 },
                        info: "Gives 1 thorns to all allies in the last row."
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 2 },
                        info: "Gives 2 thorns to all allies in the last row."
                    }
                ]
            },
            {
                id: "luckystone", // TODO - doubles the chance for rare stones
                abilityLevels: [
                    {
                        on: EVENT.CHOOSE_STONE,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 1 },
                        info: "SHOULD Double the chance for rare stones to appear in the shop. CURRENTLY BROKEN",
                    },
                    {
                        on: EVENT.CHOOSE_STONE,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 2 },
                        info: "SHOULD Triple the chance for rare stones to appear in the shop. CURRENTLY BROKEN",
                    }
                ]
            },
            {
                id: "steppingstone", // Deals 1 damage to enemies that move
                abilityLevels: [
                    {
                        on: EVENT.ENTITY_MOVED,
                        conditions: {target: {side: TARGET_SIDE.OPPONENT, entity: {}}},
                        target: "target",
                        attack: { baseDamage: 1 },
                        info: "Deals 1 damage to enemies whenever they move."
                    },
                    {
                        on: EVENT.ENTITY_MOVED,
                        conditions: {target: {side: TARGET_SIDE.OPPONENT, entity: {}}},
                        target: "target",
                        attack: { baseDamage: 2 },
                        info: "Deals 2 damage to enemies whenever they move."
                    }
                ]
            },
        ]
    }
}