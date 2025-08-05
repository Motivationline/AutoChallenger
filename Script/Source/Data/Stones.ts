namespace Script {
    export namespace DataContent {
        export const stones: StoneData[] = [
            {
                id: "healstone",
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.HEAL, level: 1 }
                    },
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: SPELL_TYPE.HEAL, level: 1 }
                    }
                ]
            },
            {
                id: "shieldstone",
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: SPELL_TYPE.SHIELD, level: 1 }
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: SPELL_TYPE.SHIELD, level: 2 }
                    }
                ]
            },
            {
                id: "brick",
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: {type: SPELL_TYPE.SHIELD, level: 1}
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: {type: SPELL_TYPE.SHIELD, level: 2}
                    }
                ]
            },
            {
                id: "knowledgestone", //TODO - 1 / 2 additional exp points
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 }
                    },
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 }
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

                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 }
                    }
                ]
            },
            {
                id: "punchstone", // Should deal 1 damage to a random enemy on fight start.
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: {maxNumTargets: 1} },
                        attack: { baseDamage: 1 },
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 2 } },
                        attack: { baseDamage: 1 },
                    }
                ]
            },
            {
                id: "warningstone", // Should give 1 random enemy weakness at fight start.
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.WEAKNESS, level: 1 }
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1, sortBy: TARGET_SORT.STRONGEST } },
                        spell: { type: SPELL_TYPE.WEAKNESS, level: 1 }
                    }
                ]
            },
            {
                id: "glitterstone", //TODO - should reward 1 / 2 gold at the end of combat
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 1 }
                    },
                    {
                        on: EVENT.FIGHT_END,
                        target: { side: TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: SPELL_TYPE.GOLD, level: 2 }
                    }
                ]
            },
            {
                id: "pointystone", // Should give all Eumlinge in the last row thorns
                abilityLevels: [
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 1 }
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 2 }
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
                        info: "Doubles chance for rare stones to appear in the shop.",
                    },
                    {
                        on: EVENT.CHOOSE_STONE,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: AREA_SHAPE.COLUMN, position: AREA_POSITION.ABSOLUTE } },
                        spell: { type: SPELL_TYPE.THORNS, level: 2 },
                        info: "Triples chance for rare stones to appear in the shop.",
                    }
                ]
            },
            {
                id: "steppingstone", // Should deal 1 damage to enemies that move (currently to everyone hehe)
                abilityLevels: [
                    {
                        on: EVENT.ENTITY_MOVE,
                        target: "target",
                        attack: { baseDamage: 1 }
                    },
                    {
                        on: EVENT.ENTITY_MOVE,
                        target: "target",
                        attack: { baseDamage: 2 }
                    }
                ]
            },
        ]
    }
}