/// <reference path="../Fight/Move.ts" />
/// <reference path="../Fight/Target.ts" />
/// <reference path="../Fight/Spell.ts" />
/// <reference path="../Misc/Types.ts" />

namespace Script {
    export namespace DataContent {
        export const entities: EntityData[] = [
            {
                id: "e1",
                health: 10,
            },
            {
                id: "e2",
                health: 10,
            },
            {
                id: "e3",
                health: 10,
            },
            {
                id: "e4",
                health: 10,
            },
            {
                id: "e5",
                health: 10,
            },
            {
                id: "e6",
                health: 10,
            },
            {
                id: "e7",
                health: 10,
            },
            {
                id: "e8",
                health: 10,
            },
            {
                id: "e9",
                health: 10,
            },
            {
                id: "attackTests",
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    shape: AREA_SHAPE.COLUMN,
                                    // pattern: [[0, 0, 1], [0, 0, 0], [0, 0, 0]],
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                },
                                side: TARGET_SIDE.OPPONENT,
                            },
                            baseDamage: 1,
                        }
                    ],
                    selection: {
                        order: SELECTION_ORDER.ALL,
                    }
                }
            },
            {
                id: "parent",
                health: 5,
            },
            {
                id: "moveSingle",
                parent: "parent",
                moves: { direction: DIRECTION_RELATIVE.FORWARD, distance: 1 }
            },
            {
                id: "moveMultiple",
                health: 5,
                moves: {
                    options: [
                        { direction: DIRECTION_RELATIVE.FORWARD, distance: 1 },
                        { rotateBy: 2, direction: DIRECTION_RELATIVE.FORWARD, distance: 1 },
                    ],
                    selection: {
                        order: SELECTION_ORDER.ALL,
                        amount: 2, // could also leave out
                    }
                },
                startDirection: 5,
            },
            {
                id: "attackRandomEnemy",
                health: 10,
                attacks: {
                    target: { // can also use TARGET.RANDOM_ENEMY preset
                        side: TARGET_SIDE.OPPONENT,
                        entity: {
                            maxNumTargets: 1,
                            sortBy: TARGET_SORT.RANDOM,
                        }
                    },
                    baseDamage: 1,
                }
            },
            {
                id: "multipleAttacksOnlyOnePerRound",
                health: 10,
                attacks: {
                    options: [
                        {
                            target: TARGET.RANDOM_ENEMY,
                            baseDamage: 1,
                        },
                        {
                            target: TARGET.RANDOM_ALLY,
                            baseDamage: -1,
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            }
                        }
                    ],
                    selection: {
                        order: SELECTION_ORDER.SEQUENTIAL,
                        amount: 2,
                    }
                }
            },
            {
                id: "spell",
                spells: {
                    target: {
                        area: {
                            position: AREA_POSITION.ABSOLUTE,
                            absolutePosition: [1, 1],
                            shape: AREA_SHAPE.PATTERN,
                            pattern: [
                                [1, 0, 1,],
                                [0, 1, 1,],
                                [1, 0, 1,]]
                        },
                        side: TARGET_SIDE.OPPONENT,
                    },
                    type: SPELL_TYPE.VULNERABLE,
                    level: 2, // optional, 1 by default
                }
            },
            {
                id: "spells",
                spells: {
                    options: [
                        {   // Shield yourself
                            target: TARGET.SELF, // shortcut
                            type: SPELL_TYPE.SHIELD,
                            level: 1,
                        },
                        {
                            // give everyone in the same column as you  (but not yourself) thorns
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.RELATIVE_SAME,
                                    shape: AREA_SHAPE.COLUMN,
                                },
                                excludeSelf: true,
                            },
                            type: SPELL_TYPE.THORNS,
                        }
                    ],
                    selection: {
                        order: SELECTION_ORDER.SEQUENTIAL,
                        amount: 1,
                    }
                },
                resistances: [
                    [SPELL_TYPE.FIRE, 0], // fully resistant to fire
                    [SPELL_TYPE.POISON, 2], // double damage from poison
                ]
            },
            {
                id: "abilities",
                abilities: [
                    {   // after you get hit, gain 1 shield
                        on: EVENT.ENTITY_HURT,
                        conditions: [
                            {
                                target: TARGET.SELF,
                            }
                        ],
                        target: "target",
                        spell: {
                            type: SPELL_TYPE.SHIELD,
                            level: 1,
                        }
                    },
                    {   // deal damage to attacker if it deals 2 - 3 damage
                        on: EVENT.ENTITY_HURT,
                        conditions: [
                            {
                                target: TARGET.SELF,
                                value: {
                                    min: 2,
                                    max: 3,
                                }
                            }
                        ],
                        target: "cause",
                        attack: {
                            baseDamage: 1,
                        }
                    },
                    {   // if an enemy dies, get a thorns buff for yourself
                        on: EVENT.ENTITY_DIED,
                        conditions: [{
                            target: { entity: {}, side: TARGET_SIDE.OPPONENT }
                        }],
                        target: TARGET.SELF,
                        spell: {
                            type: SPELL_TYPE.THORNS,
                            level: 1,
                        }
                    },
                    {   // if an ally dies, give the strongest enemy 2 weakness
                        on: EVENT.ENTITY_DIED,
                        conditions: [{
                            target: { side: TARGET_SIDE.ALLY, entity: {}, excludeSelf: true }
                        }],
                        target: {
                            side: TARGET_SIDE.OPPONENT,
                            entity: {
                                sortBy: TARGET_SORT.STRONGEST,
                                maxNumTargets: 1,
                            }
                        },
                        spell: {
                            type: SPELL_TYPE.WEAKNESS,
                            level: 2,
                        }
                    },
                    {   // start of the game give every ally in the first column 2 strength
                        on: EVENT.FIGHT_START,
                        target: {
                            side: TARGET_SIDE.ALLY,
                            area: {
                                position: AREA_POSITION.ABSOLUTE,
                                absolutePosition: [0, 0],
                                shape: AREA_SHAPE.COLUMN,
                            }
                        },
                        spell: {
                            type: SPELL_TYPE.STRENGTH,
                            level: 2,
                        }
                    }
                ]
            },
            {
                id: "cactusCrawler", // doesn't attack but gets thorns after moving
                health: 1,
                moves: { direction: DIRECTION_RELATIVE.FORWARD, distance: 1 },
                startDirection: 6, // down
                abilities: [
                    {   // gain thorns 1 after moving
                        on: EVENT.ENTITY_MOVED,
                        conditions: [
                            {
                                target: TARGET.SELF,
                                value: {
                                    min: 1
                                }
                            }
                        ],
                        target: TARGET.SELF,
                        spell: {
                            type: SPELL_TYPE.THORNS,
                            level: 1,
                        }
                    }
                ]
            },
            {
                id: "flameFlinger", // low hp but massive single target damage
                health: 1,
                attacks: {
                    baseDamage: 2,
                    target: {
                        side: TARGET_SIDE.OPPONENT,
                        area: {
                            position: AREA_POSITION.RELATIVE_MIRRORED,
                            shape: AREA_SHAPE.SINGLE,
                        },
                    }
                }
            },
            {
                id: "worriedWall", // very strong wall, which dies when others die
                health: 6,
                abilities: [
                    {   // if an ally dies, deal 6 damage to self
                        on: EVENT.ENTITY_DIED,
                        conditions: [{
                            target: { side: TARGET_SIDE.ALLY, entity: {}, excludeSelf: true }
                        }],
                        target: TARGET.SELF,
                        attack: {
                            baseDamage: 6,
                        }
                    },
                ]
            }
        ]
    }
}