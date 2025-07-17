/// <reference path="../Fight/Move.ts" />
/// <reference path="../Fight/Target.ts" />
/// <reference path="../Fight/Spell.ts" />
/// <reference path="../Misc/Types.ts" />
/// <reference path="../Eventsystem.ts" />

namespace Script {
    export namespace DataContent {
        export const entities: EntityData[] = [
            {
                id: "e1",
                health: 10,
                abilities: [
                    {
                        on: EVENT.ENTITY_HURT,
                        target: "cause",
                        conditions: [{ target: { entity: {}, side: TARGET_SIDE.ALLY } }],
                        attack: {
                            baseDamage: 1,
                        }
                    }
                ]
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
                id: "kacki",
                health: 10,
            },
            {
                id: "defaultSkin",
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
                },
                spells: {
                    target: TARGET.RANDOM_ENEMY,
                    type: SPELL_TYPE.FIRE,
                    level: 2,
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
                    SPELL_TYPE.FIRE, // fully resistant to fire
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
                id: "R-Eumling",
                health: 3,
                attacks: {
                    baseDamage: 1,
                    target: {
                        side: TARGET_SIDE.OPPONENT,
                        area: {
                            position: AREA_POSITION.RELATIVE_FIRST_IN_ROW,
                            shape: AREA_SHAPE.SINGLE,
                        },
                    }
                }
            },
            {
                id: "RA-Eumling",
                health: 4,
                attacks: {
                    options: [
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.ROW,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.COLUMN,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.DIAGONALS,
                                },
                            },
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 1,
                    }
                }
            },
            {
                id: "RI-Eumling",
                health: 4,
                attacks: {
                    baseDamage: 1,
                    baseCritChance: 25,
                    target: {
                        side: TARGET_SIDE.OPPONENT,
                        area: {
                            position: AREA_POSITION.RELATIVE_FIRST_IN_ROW, // TODO: NEEDS TO ATTACK NEXT ROW IF NO ENEMY
                            shape: AREA_SHAPE.SINGLE,
                        },
                    }
                }
            },
            {
                id: "RAC-Eumling",
                health: 5,
                spells: {
                    options: [
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.RELATIVE_SAME,
                                    shape: AREA_SHAPE.ROW,
                                },
                            },
                            type: SPELL_TYPE.STRENGTH,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.RELATIVE_SAME,
                                    shape: AREA_SHAPE.COLUMN,
                                },
                            },
                            type: SPELL_TYPE.STRENGTH,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.RELATIVE_SAME,
                                    shape: AREA_SHAPE.DIAGONALS,
                                },
                            },
                            type: SPELL_TYPE.STRENGTH,
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 1,
                    }
                }
            },
            {
                id: "RAE-Eumling",
                health: 5,
                attacks: {
                    options: [
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.ROW,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.COLUMN,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: TARGET_SIDE.OPPONENT,
                                area: {
                                    position: AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: AREA_SHAPE.DIAGONALS,
                                },
                            },
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 1,
                    }
                },
                abilities: [ // TODO: Needs to earn +1 gold for each damage dealt
                ]
            },
            {
                id: "RIC-Eumling",
                health: 5,
                attacks: {
                    baseDamage: 1,
                    baseCritChance: 25,
                    target: {
                        side: TARGET_SIDE.OPPONENT,
                        area: {
                            position: AREA_POSITION.RELATIVE_MIRRORED, // TODO: NEEDS TO ATTACK NEXT ROW IF NO ENEMY
                            shape: AREA_SHAPE.ROW,
                        },
                    }
                }
            },
            {
                id: "RIE-Eumling",
                health: 5,
                attacks: {
                    baseDamage: 1,
                    baseCritChance: 50,
                    target: {
                        side: TARGET_SIDE.OPPONENT,
                        area: {
                            position: AREA_POSITION.RELATIVE_FIRST_IN_ROW, // TODO: NEEDS TO ATTACK NEXT ROW IF NO ENEMY
                            shape: AREA_SHAPE.SINGLE,
                        },
                    }
                },
                abilities: [ // TODO: Needs to earn +2 gold every time it crits
                ]
            },
            {
                id: "S-Eumling",
                health: 4,
                spells: {
                        target: TARGET.SELF,
                        type: SPELL_TYPE.HEAL,
                        level: 1,
                },
            },
            {
                id: "SA-Eumling",
                health: 5,
                spells: {
                    options: [
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 3,
                    }
                },
                abilities: [{
                    on: EVENT.ENTITY_HEALED,
                    conditions: [{
                        target: { side: TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                    }],
                    target: "target",
                    spell: {
                        type: SPELL_TYPE.SHIELD,
                        level: 1,
                    }
                }]
            },
            {
                id: "SI-Eumling",
                health: 5,
                spells: {
                    target: TARGET.RANDOM_ALLY,
                    type: SPELL_TYPE.HEAL,
                    level: 2,
                },
            },
            {
                id: "SAC-Eumling",
                health: 6,
                spells: {
                    options: [
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 3,
                    }
                },
                abilities: [{
                    on: EVENT.ENTITY_HEALED,
                    conditions: [{
                        target: { side: TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                    }],
                    target: "target",
                    spell: {
                        type: SPELL_TYPE.SHIELD,
                        level: 2,
                    }
                }]
            },
            {
                id: "SAE-Eumling",
                health: 6,
                spells: {
                    options: [
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 3,
                    }
                },
                abilities: [{ //TODO: +1 GOLD IF HE HEALS
                    on: EVENT.ENTITY_HEALED,
                    conditions: [{
                        target: { side: TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                    }],
                    target: "target",
                    spell: {
                        type: SPELL_TYPE.SHIELD,
                        level: 1,
                    }
                }]
            },
            {
                id: "SIC-Eumling",
                health: 6,
                spells: {
                    options: [
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: TARGET_SIDE.ALLY,
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: AREA_SHAPE.SINGLE,
                                },
                            },
                            type: SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 6,
                    }
                }
            },
            {
                id: "SIE-Eumling", // TODO: +1 Gold per heart that is healed
                health: 6,
                spells: {
                    target: TARGET.RANDOM_ALLY,
                    type: SPELL_TYPE.HEAL,
                    level: 2,
                },
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
                id: "boxingBush", // enemy that attacks the entire mirrored column for 1
                health: 2,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    shape: AREA_SHAPE.COLUMN,
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
                id: "punchingPalmtree", // enemy that attacks everywhere but the center
                health: 1,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: AREA_SHAPE.SQUARE,
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
                id: "sandSitter", // enemy that attacks a plus, but spawns in round 2 (not implemented yet)
                health: 1,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    position: AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: AREA_SHAPE.PLUS,
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
                id: "worriedWall", // very strong wall, which dies when others die
                health: 6,
                abilities: [
                    {   // if an ally dies, deal inf damage to self
                        on: EVENT.ENTITY_DIED,
                        conditions: [{
                            target: { side: TARGET_SIDE.ALLY, entity: {}, excludeSelf: true }
                        }],
                        target: TARGET.SELF,
                        attack: {
                            baseDamage: Infinity,
                        }
                    },
                ]
            },
            {
                id: "countdownCoconut", // coconut that blows up on the final turn
                health: 2,
                abilities: [
                    {
                        on: EVENT.ROUND_END,
                        target: {
                            area: {
                                position: AREA_POSITION.ABSOLUTE,
                                absolutePosition: [1, 1],
                                shape: AREA_SHAPE.PATTERN,
                                pattern: [
                                    [1, 1, 1,],
                                    [1, 1, 1,],
                                    [1, 1, 1,]]
                            },
                            side: TARGET_SIDE.OPPONENT,
                        },
                        attack: {
                            baseDamage: 2,
                        }, // NEEDS TO BLOW UP ITSELF ASWELL
                    },
                ]
            },
            {

                id: "Björn", // Björn's entity for testing
                health: 100000000
            },
            {
                id: "pushover",
                health: 1,
            }
        ]
    }
}