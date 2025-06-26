namespace Script {
    export namespace DataContent {
        export const relics: RelicData[] = [
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
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: AREA_SHAPE.ROW, position: AREA_POSITION.ABSOLUTE } },
                        spell: {type: SPELL_TYPE.SHIELD, level: 1}
                    },
                    {
                        on: EVENT.FIGHT_START,
                        target: { side: TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: AREA_SHAPE.ROW, position: AREA_POSITION.ABSOLUTE } },
                        spell: {type: SPELL_TYPE.SHIELD, level: 2}
                    }
                ]
            }
        ]
    }
}