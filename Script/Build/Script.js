"use strict";
var Script;
(function (Script) {
    let EVENT;
    (function (EVENT) {
        EVENT["FIGHT_PREPARE"] = "fightPrepare";
        EVENT["FIGHT_PREPARE_COMPLETED"] = "fightPrepareCompleted";
        EVENT["FIGHT_START"] = "fightStart";
        EVENT["FIGHT_END"] = "fightEnd";
        EVENT["ROUND_START"] = "roundStart";
        EVENT["ROUND_END"] = "roundEnd";
        EVENT["ENTITY_ATTACK"] = "entityAttack";
        EVENT["ENTITY_ATTACKED"] = "entityAttacked";
        EVENT["ENTITY_HEAL"] = "entityHeal";
        EVENT["ENTITY_HEALED"] = "entityHealed";
        EVENT["ENTITY_HURT_BEFORE"] = "entityHurtBefore";
        EVENT["ENTITY_HURT"] = "entityHurt";
        EVENT["ENTITY_DIES"] = "entityDies";
        EVENT["ENTITY_DIED"] = "entityDied";
        EVENT["ENTITY_CREATE"] = "entityCreate";
        EVENT["ENTITY_CREATED"] = "entityCreated";
        EVENT["ENTITY_MOVE"] = "entityMove";
        EVENT["ENTITY_MOVED"] = "entityMoved";
        EVENT["TRIGGERED_ABILITY"] = "triggeredAbility";
    })(EVENT = Script.EVENT || (Script.EVENT = {}));
    class EventBus {
        static { this.listeners = new Map(); }
        static removeAllEventListeners() {
            this.listeners.clear();
        }
        static addEventListener(_ev, _fn) {
            if (!this.listeners.has(_ev)) {
                this.listeners.set(_ev, []);
            }
            this.listeners.get(_ev).push(_fn);
        }
        static removeEventListener(_ev, _fn) {
            let listeners = this.listeners.get(_ev);
            if (!listeners)
                return;
            let index = listeners.findIndex((v) => v === _fn);
            if (index < 0)
                return;
            listeners.splice(index, 1);
        }
        static async dispatchEvent(_ev) {
            if (!this.listeners.has(_ev.type))
                return;
            for (let listener of this.listeners.get(_ev.type)) {
                await listener(_ev);
            }
        }
    }
    Script.EventBus = EventBus;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let DIRECTION_RELATIVE;
    (function (DIRECTION_RELATIVE) {
        DIRECTION_RELATIVE["FORWARD"] = "forward";
        DIRECTION_RELATIVE["BACKWARD"] = "backward";
        DIRECTION_RELATIVE["LEFT"] = "left";
        DIRECTION_RELATIVE["RIGHT"] = "right";
    })(DIRECTION_RELATIVE = Script.DIRECTION_RELATIVE || (Script.DIRECTION_RELATIVE = {}));
})(Script || (Script = {}));
var Script;
(function (Script) {
    //#region Definitions
    let SELECTION_ORDER;
    (function (SELECTION_ORDER) {
        /** Selects options in order, loops around when found */
        SELECTION_ORDER["SEQUENTIAL"] = "sequential";
        /** Chooses random options for the entire fight */
        SELECTION_ORDER["RANDOM_EACH_FIGHT"] = "randomEachFight";
        /** Chooses random options for each round */
        SELECTION_ORDER["RANDOM_EACH_ROUND"] = "randomEachRound";
        /** Chooses all options, always starting from the first */
        SELECTION_ORDER["ALL"] = "all";
    })(SELECTION_ORDER = Script.SELECTION_ORDER || (Script.SELECTION_ORDER = {}));
    //#region Area
    let AREA_SHAPE_PATTERN;
    (function (AREA_SHAPE_PATTERN) {
        /** Choose your own pattern */
        AREA_SHAPE_PATTERN["PATTERN"] = "pattern";
    })(AREA_SHAPE_PATTERN = Script.AREA_SHAPE_PATTERN || (Script.AREA_SHAPE_PATTERN = {}));
    let AREA_SHAPE_OTHERS;
    (function (AREA_SHAPE_OTHERS) {
        /** Target a single Slot */
        AREA_SHAPE_OTHERS["SINGLE"] = "single";
        /** Target an entire row */
        AREA_SHAPE_OTHERS["ROW"] = "row";
        /** Target an entire column */
        AREA_SHAPE_OTHERS["COLUMN"] = "column";
        /** Target enemies in a plus shape, so basically column + row */
        AREA_SHAPE_OTHERS["PLUS"] = "plus";
        /** Target enemies in an X shape, so all the corners but not the center */
        AREA_SHAPE_OTHERS["DIAGONALS"] = "diagonals";
        /** Target all enemies except in the center position */
        AREA_SHAPE_OTHERS["SQUARE"] = "square";
    })(AREA_SHAPE_OTHERS = Script.AREA_SHAPE_OTHERS || (Script.AREA_SHAPE_OTHERS = {}));
    Script.AREA_SHAPE = Object.assign({}, AREA_SHAPE_PATTERN, AREA_SHAPE_OTHERS);
    let AREA_POSITION_ABSOLUTE;
    (function (AREA_POSITION_ABSOLUTE) {
        /** Choose a fixed position */
        AREA_POSITION_ABSOLUTE["ABSOLUTE"] = "absolute";
    })(AREA_POSITION_ABSOLUTE = Script.AREA_POSITION_ABSOLUTE || (Script.AREA_POSITION_ABSOLUTE = {}));
    let AREA_POSITION_RELATIVE;
    (function (AREA_POSITION_RELATIVE) {
        /** Selects first (from center) in the same row */
        AREA_POSITION_RELATIVE["RELATIVE_FIRST_IN_ROW"] = "relativeFirstInRow";
        /** Selects last (from center) in the same row */
        AREA_POSITION_RELATIVE["RELATIVE_LAST_IN_ROW"] = "relativeLastInRow";
        /** Selects the same spot, so top left -> top left */
        AREA_POSITION_RELATIVE["RELATIVE_SAME"] = "relativeSame";
        /** Selects the same spot but mirrored, so top left -> top right*/
        AREA_POSITION_RELATIVE["RELATIVE_MIRRORED"] = "relativeMirrored";
    })(AREA_POSITION_RELATIVE = Script.AREA_POSITION_RELATIVE || (Script.AREA_POSITION_RELATIVE = {}));
    Script.AREA_POSITION = Object.assign({}, AREA_POSITION_ABSOLUTE, AREA_POSITION_RELATIVE);
    //#endregion
    //#region Target
    let TARGET_SIDE;
    (function (TARGET_SIDE) {
        /** Your own side */
        TARGET_SIDE["ALLY"] = "ally";
        /** Your opponents side */
        TARGET_SIDE["OPPONENT"] = "opponent";
    })(TARGET_SIDE = Script.TARGET_SIDE || (Script.TARGET_SIDE = {}));
    let TARGET_SORT;
    (function (TARGET_SORT) {
        /** Whatever order they happen to be in memory in */
        TARGET_SORT["ARBITRARY"] = "arbitrary";
        /** randomize order */
        TARGET_SORT["RANDOM"] = "random";
        /** order by attack / damage (highest first) */
        TARGET_SORT["STRONGEST"] = "strongest";
        /** order by health (highest first) */
        TARGET_SORT["HEALTHIEST"] = "healthiest";
    })(TARGET_SORT = Script.TARGET_SORT || (Script.TARGET_SORT = {}));
    let TARGET;
    (function (TARGET) {
        TARGET.SELF = { area: { position: Script.AREA_POSITION.RELATIVE_SAME, shape: Script.AREA_SHAPE.SINGLE }, side: TARGET_SIDE.ALLY };
        TARGET.FIRST_ENEMY_SAME_ROW = { area: { position: Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW, shape: Script.AREA_SHAPE.SINGLE }, side: TARGET_SIDE.OPPONENT };
        TARGET.RANDOM_ENEMY = { entity: { sortBy: TARGET_SORT.RANDOM, maxNumTargets: 1 }, side: TARGET_SIDE.OPPONENT };
        TARGET.RANDOM_ALLY = { entity: { sortBy: TARGET_SORT.RANDOM, maxNumTargets: 1 }, side: TARGET_SIDE.ALLY, excludeSelf: true };
    })(TARGET = Script.TARGET || (Script.TARGET = {}));
    //#endregion
    //#endregion
    //#region Implementation
    function getTargets(_target, _allies, _opponents, _self) {
        if (!_target)
            return [];
        const targets = [];
        const side = _target.side === TARGET_SIDE.ALLY ? _allies : _opponents;
        // entity selector
        if ("entity" in _target) {
            side.forEachElement((entity) => {
                if (entity)
                    targets.push(entity);
            });
            switch (_target.entity.sortBy) {
                case "random": {
                    targets.sort(() => Math.random() - 0.5);
                    break;
                }
                case "strongest": {
                    targets.sort((a, b) => a.getOwnDamage() - b.getOwnDamage());
                    break;
                }
                case "healthiest": {
                    targets.sort((a, b) => a.currentHealth - b.currentHealth);
                    break;
                }
                case "arbitrary":
                default: {
                    break;
                }
            }
            if (_target.entity.reverse) {
                targets.reverse();
            }
            if (_target.entity.maxNumTargets !== undefined && targets.length > _target.entity.maxNumTargets) {
                targets.length = _target.entity.maxNumTargets;
            }
            return targets;
        }
        // area selector
        else if ("area" in _target) {
            let pos;
            if (_target.area.position !== AREA_POSITION_ABSOLUTE.ABSOLUTE && !_self)
                return [];
            switch (_target.area.position) {
                case Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW: {
                    for (let i = 0; i < 3; i++) {
                        if (side.get([i, _self.position[1]])) {
                            pos = [i, _self.position[1]];
                            break;
                        }
                    }
                    break;
                }
                case Script.AREA_POSITION.RELATIVE_LAST_IN_ROW: {
                    for (let i = 2; i >= 0; i--) {
                        if (side.get([i, _self.position[1]])) {
                            pos = [i, _self.position[1]];
                            break;
                        }
                    }
                    break;
                }
                case Script.AREA_POSITION.RELATIVE_SAME: {
                    // intuitively for the designer "same" means "the same spot on the opposite side".
                    // But because the own side is mirrored internally, "SAME" internally means mirrored and vice versa
                    pos = [2 - _self.position[0], _self.position[1]];
                    break;
                }
                case Script.AREA_POSITION.RELATIVE_MIRRORED: {
                    pos = [_self.position[0], _self.position[1]];
                    break;
                }
                case Script.AREA_POSITION.ABSOLUTE: {
                    pos = _target.area.absolutePosition;
                    break;
                }
            }
            if (!pos)
                return [];
            let pattern = new Script.Grid();
            let patternIsRelative = true;
            switch (_target.area.shape) {
                case Script.AREA_SHAPE.SINGLE:
                    pattern.set(pos, true);
                    patternIsRelative = false;
                    break;
                case Script.AREA_SHAPE.ROW:
                    pattern.set([0, pos[1]], true);
                    pattern.set([1, pos[1]], true);
                    pattern.set([2, pos[1]], true);
                    patternIsRelative = false;
                    break;
                case Script.AREA_SHAPE.COLUMN:
                    pattern.set([pos[0], 0], true);
                    pattern.set([pos[0], 1], true);
                    pattern.set([pos[0], 2], true);
                    patternIsRelative = false;
                    break;
                case Script.AREA_SHAPE.PLUS:
                    pattern.set([1, 0], true);
                    pattern.set([0, 1], true);
                    pattern.set([1, 1], true);
                    pattern.set([2, 1], true);
                    pattern.set([1, 2], true);
                    break;
                case Script.AREA_SHAPE.DIAGONALS:
                    pattern.set([0, 0], true);
                    pattern.set([2, 0], true);
                    pattern.set([0, 2], true);
                    pattern.set([2, 2], true);
                    break;
                case Script.AREA_SHAPE.SQUARE:
                    pattern = new Script.Grid([[true, true, true], [true, false, true], [true, true, true]]);
                    break;
                case Script.AREA_SHAPE.PATTERN: {
                    if (_target.area.shape === Script.AREA_SHAPE.PATTERN) { // only so that TS doesn't complain.
                        new Script.Grid(_target.area.pattern).forEachElement((element, pos) => {
                            pattern.set(pos, !!element);
                        });
                    }
                }
            }
            if (patternIsRelative && (pos[0] !== 1 || pos[1] !== 1)) {
                // 1, 1 is the center, so the difference to that is how much the pattern is supposed to be moved
                let delta = [pos[0] - 1, pos[1] - 1];
                let movedPattern = new Script.Grid();
                pattern.forEachElement((el, pos) => {
                    let newPos = [pos[0] + delta[0], pos[1] + delta[1]];
                    movedPattern.set(newPos, !!el);
                });
                pattern = movedPattern;
            }
            // final pattern achieved, get the actual entities in these areas now
            side.forEachElement((el, pos) => {
                if (!el)
                    return;
                if (pattern.get(pos))
                    targets.push(el);
            });
            return targets;
        }
        return targets;
    }
    Script.getTargets = getTargets;
    //#endregion
})(Script || (Script = {}));
var Script;
(function (Script) {
    let SPELL_TYPE;
    (function (SPELL_TYPE) {
        // positive buffs
        /** Blocks 1 damage per shield, destroyed after */
        SPELL_TYPE["SHIELD"] = "shield";
        /** Reflects damage back to attacker once, shields from damage. */
        SPELL_TYPE["MIRROR"] = "mirror";
        /** Doubles damage of next attack, destroyed after. Max 1 used per attack. */
        SPELL_TYPE["STRENGTH"] = "strength";
        /** Deals 1 damage to attacker once, destroyed after. */
        SPELL_TYPE["THORNS"] = "thorns";
        // negative
        /** Takes double damage from next attack. Max 1 used per attack */
        SPELL_TYPE["VULNERABLE"] = "vulnerable";
        /** Next attack doesn't deal any damage. Max 1 used per attack */
        SPELL_TYPE["WEAKNESS"] = "weakness";
        /** Deals 1 damage at the end of the round per poison stack. Removes 1 per round. */
        SPELL_TYPE["POISON"] = "poison";
        /** Deals 1 damage at the end of the round. Removes 1 per round. */
        SPELL_TYPE["FIRE"] = "fire";
        // not fight related
        SPELL_TYPE["GOLD"] = "gold";
    })(SPELL_TYPE = Script.SPELL_TYPE || (Script.SPELL_TYPE = {}));
})(Script || (Script = {}));
/// <reference path="../Fight/Move.ts" />
/// <reference path="../Fight/Target.ts" />
/// <reference path="../Fight/Spell.ts" />
/// <reference path="../Misc/Types.ts" />
/// <reference path="../Eventsystem.ts" />
var Script;
/// <reference path="../Fight/Move.ts" />
/// <reference path="../Fight/Target.ts" />
/// <reference path="../Fight/Spell.ts" />
/// <reference path="../Misc/Types.ts" />
/// <reference path="../Eventsystem.ts" />
(function (Script) {
    let DataContent;
    (function (DataContent) {
        DataContent.entities = [
            {
                id: "e1",
                health: 10,
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_HURT,
                        target: "cause",
                        conditions: [{ target: { entity: {}, side: Script.TARGET_SIDE.ALLY } }],
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
                id: "attackTests",
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    shape: Script.AREA_SHAPE.COLUMN,
                                    // pattern: [[0, 0, 1], [0, 0, 0], [0, 0, 0]],
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                },
                                side: Script.TARGET_SIDE.OPPONENT,
                            },
                            baseDamage: 1,
                        }
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.ALL,
                    }
                },
                spells: {
                    target: Script.TARGET.RANDOM_ENEMY,
                    type: Script.SPELL_TYPE.FIRE,
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
                moves: { direction: Script.DIRECTION_RELATIVE.FORWARD, distance: 1 }
            },
            {
                id: "moveMultiple",
                health: 5,
                moves: {
                    options: [
                        { direction: Script.DIRECTION_RELATIVE.FORWARD, distance: 1 },
                        { rotateBy: 2, direction: Script.DIRECTION_RELATIVE.FORWARD, distance: 1 },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.ALL,
                        amount: 2, // could also leave out
                    }
                },
                startDirection: 5,
            },
            {
                id: "attackRandomEnemy",
                health: 10,
                attacks: {
                    target: {
                        side: Script.TARGET_SIDE.OPPONENT,
                        entity: {
                            maxNumTargets: 1,
                            sortBy: Script.TARGET_SORT.RANDOM,
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
                            target: Script.TARGET.RANDOM_ENEMY,
                            baseDamage: 1,
                        },
                        {
                            target: Script.TARGET.RANDOM_ALLY,
                            baseDamage: -1,
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            }
                        }
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.SEQUENTIAL,
                        amount: 2,
                    }
                }
            },
            {
                id: "spell",
                spells: {
                    target: {
                        area: {
                            position: Script.AREA_POSITION.ABSOLUTE,
                            absolutePosition: [1, 1],
                            shape: Script.AREA_SHAPE.PATTERN,
                            pattern: [
                                [1, 0, 1,],
                                [0, 1, 1,],
                                [1, 0, 1,]
                            ]
                        },
                        side: Script.TARGET_SIDE.OPPONENT,
                    },
                    type: Script.SPELL_TYPE.VULNERABLE,
                    level: 2, // optional, 1 by default
                }
            },
            {
                id: "spells",
                spells: {
                    options: [
                        {
                            target: Script.TARGET.SELF, // shortcut
                            type: Script.SPELL_TYPE.SHIELD,
                            level: 1,
                        },
                        {
                            // give everyone in the same column as you  (but not yourself) thorns
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_SAME,
                                    shape: Script.AREA_SHAPE.COLUMN,
                                },
                                excludeSelf: true,
                            },
                            type: Script.SPELL_TYPE.THORNS,
                        }
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.SEQUENTIAL,
                        amount: 1,
                    }
                },
                resistances: [
                    Script.SPELL_TYPE.FIRE, // fully resistant to fire
                ]
            },
            {
                id: "abilities",
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_HURT,
                        conditions: [
                            {
                                target: Script.TARGET.SELF,
                            }
                        ],
                        target: "target",
                        spell: {
                            type: Script.SPELL_TYPE.SHIELD,
                            level: 1,
                        }
                    },
                    {
                        on: Script.EVENT.ENTITY_HURT,
                        conditions: [
                            {
                                target: Script.TARGET.SELF,
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
                    {
                        on: Script.EVENT.ENTITY_DIED,
                        conditions: [{
                                target: { entity: {}, side: Script.TARGET_SIDE.OPPONENT }
                            }],
                        target: Script.TARGET.SELF,
                        spell: {
                            type: Script.SPELL_TYPE.THORNS,
                            level: 1,
                        }
                    },
                    {
                        on: Script.EVENT.ENTITY_DIED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: true }
                            }],
                        target: {
                            side: Script.TARGET_SIDE.OPPONENT,
                            entity: {
                                sortBy: Script.TARGET_SORT.STRONGEST,
                                maxNumTargets: 1,
                            }
                        },
                        spell: {
                            type: Script.SPELL_TYPE.WEAKNESS,
                            level: 2,
                        }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: {
                            side: Script.TARGET_SIDE.ALLY,
                            area: {
                                position: Script.AREA_POSITION.ABSOLUTE,
                                absolutePosition: [0, 0],
                                shape: Script.AREA_SHAPE.COLUMN,
                            }
                        },
                        spell: {
                            type: Script.SPELL_TYPE.STRENGTH,
                            level: 2,
                        }
                    }
                ]
            },
            {
                id: "cactusCrawler", // doesn't attack but gets thorns after moving
                health: 1,
                moves: { direction: Script.DIRECTION_RELATIVE.FORWARD, distance: 1 },
                startDirection: 6, // down
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_MOVED,
                        conditions: [
                            {
                                target: Script.TARGET.SELF,
                                value: {
                                    min: 1
                                }
                            }
                        ],
                        target: Script.TARGET.SELF,
                        spell: {
                            type: Script.SPELL_TYPE.THORNS,
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
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                            shape: Script.AREA_SHAPE.SINGLE,
                        },
                    }
                }
            },
            {
                id: "idioticIcicle", // enemy that attacks the entire mirrored column for 1
                health: 1,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    shape: Script.AREA_SHAPE.COLUMN,
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                },
                                side: Script.TARGET_SIDE.OPPONENT,
                            },
                            baseDamage: 1,
                        }
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.ALL,
                    }
                }
            },
            {
                id: "boxingBug", // enemy that attacks everywhere but the center
                health: 1,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.SQUARE,
                                },
                                side: Script.TARGET_SIDE.OPPONENT,
                            },
                            baseDamage: 1,
                        }
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.ALL,
                    }
                }
            },
            {
                id: "graveGrinder", // enemy that attacks a plus, but spawns in round 2 (not implemented yet)
                health: 1,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.PLUS,
                                },
                                side: Script.TARGET_SIDE.OPPONENT,
                            },
                            baseDamage: 1,
                        }
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.ALL,
                    }
                }
            },
            {
                id: "worriedWall", // very strong wall, which dies when others die
                health: 6,
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_DIED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: true }
                            }],
                        target: Script.TARGET.SELF,
                        attack: {
                            baseDamage: Infinity,
                        }
                    },
                ]
            }
        ];
    })(DataContent = Script.DataContent || (Script.DataContent = {}));
})(Script || (Script = {}));
var Script;
(function (Script) {
    let DataContent;
    (function (DataContent) {
        DataContent.fights = [
            {
                // test eumlings
                rounds: 3, // ignore this
                // remember, opponents are usually to the left of this, so the eumling grid is mirrored internally.
                // But for your convenience right now during the test it's the way you'd see it ingame.
                entities: [
                    ["attackTests", , ,],
                    [, , ,],
                    [, , ,]
                ],
            },
            {
                // test opponent
                rounds: 3,
                entities: [
                    ["e1", "e2", "e3",],
                    ["e4", "e5", "e6",],
                    ["e7", "e8", "e9",]
                ],
            },
            {
                rounds: 3,
                entities: [
                    [, , ,],
                    [, "attackRandomEnemy", ,],
                    [, , ,]
                ],
            }
        ];
    })(DataContent = Script.DataContent || (Script.DataContent = {}));
})(Script || (Script = {}));
/// <reference path="Entities.ts" />
/// <reference path="Fights.ts" />
var Script;
/// <reference path="Entities.ts" />
/// <reference path="Fights.ts" />
(function (Script) {
    class Data {
        constructor() {
            this.data = {};
        }
        async load() {
            this.data.fights = Script.DataContent.fights;
            this.data.entities = Script.DataContent.entities;
            // copy to map for quicker access through getEntity
            this.data.entityMap = {};
            for (let entity of this.data.entities) {
                this.data.entityMap[entity.id] = entity;
            }
            // resolve inheritance
            for (let i = 0; i < this.data.entities.length; i++) {
                const entity = this.data.entities[i];
                if (entity.parent) {
                    let newEntity = this.resolveParent(entity);
                    this.data.entities[i] = newEntity;
                    this.data.entityMap[entity.id] = newEntity;
                }
            }
        }
        get fights() {
            return this.data.fights;
        }
        get entities() {
            return this.data.entities;
        }
        getEntity(_id) {
            return this.data.entityMap[_id];
        }
        resolveParent(_entity) {
            if (!_entity.parent)
                return _entity;
            let parent = this.getEntity(_entity.parent);
            if (!parent)
                return _entity;
            return { ...this.resolveParent(parent), ..._entity };
        }
    }
    Script.Data = Data;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Fight {
        constructor(_fight, _home) {
            this.rounds = _fight.rounds;
            this.arena = {
                away: Script.initEntitiesInGrid(_fight.entities, Script.Entity),
                home: _home,
            };
            this.arena.home.forEachElement((el) => {
                el?.setGrids(this.arena.home, this.arena.away);
            });
            this.arena.away.forEachElement((el) => {
                el?.setGrids(this.arena.away, this.arena.home);
            });
            this.visualizer = Script.Provider.visualizer.getFight(this);
        }
        getRounds() {
            return this.rounds;
        }
        async run() {
            // Eventlisteners
            Script.EventBus.removeAllEventListeners();
            this.arena.home.forEachElement((el) => { el?.registerEventListeners(); });
            this.arena.away.forEachElement((el) => { el?.registerEventListeners(); });
            //TODO: Add artifacts
            await this.visualizer.fightStart();
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_START });
            // run actual round
            for (let r = 0; r < this.rounds; r++) {
                await this.visualizer.roundStart();
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ROUND_START });
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ROUND_END });
                await this.visualizer.roundEnd();
                // check if round is over
                if (this.arena.home.occupiedSpots === 0) {
                    await this.visualizer.fightEnd();
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_END });
                    return console.log("Player lost");
                }
                if (this.arena.away.occupiedSpots === 0) {
                    await this.visualizer.fightEnd();
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_END });
                    return console.log("Player won");
                }
            }
            await this.visualizer.fightEnd();
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_END });
            return console.log("Player survived");
        }
        async runOneSide(_active, _passive) {
            // TODO: moves
            // spells
            await _active.forEachElementAsync(async (el) => {
                if (!el)
                    return;
                await el.useSpell(_active, _passive);
            });
            // attacks
            await _active.forEachElementAsync(async (el) => {
                if (!el)
                    return;
                await el.useAttack(_active, _passive);
            });
        }
    }
    Script.Fight = Fight;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class VisualizerNull {
        getEntity(_entity) {
            return new Script.VisualizeEntity(_entity);
        }
        getFight(_fight) {
            return new Script.VisualizeFightNull(_fight);
        }
    }
    Script.VisualizerNull = VisualizerNull;
})(Script || (Script = {}));
/// <reference path="../Visualisation/Visualizer.ts" />
var Script;
/// <reference path="../Visualisation/Visualizer.ts" />
(function (Script) {
    class Provider {
        static #data = new Script.Data();
        static #visualizer = new Script.VisualizerNull();
        static get data() {
            return this.#data;
        }
        static get visualizer() {
            return this.#visualizer;
        }
        static setVisualizer(_vis) {
            if (!_vis) {
                this.#visualizer = new Script.VisualizerNull;
                return;
            }
            this.#visualizer = _vis;
        }
    }
    Script.Provider = Provider;
})(Script || (Script = {}));
/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />
var Script;
/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    const root = new ƒ.Node("Root");
    //let tile: Tile;
    let grid;
    async function initProvider() {
        await Script.Provider.data.load();
        //TODO load correct visualizer here
        run();
    }
    function start(_event) {
        viewport = _event.detail;
        initProvider();
        //tile = new Tile("Tile", 1, new ƒ.Vector3(0, 0, 0));
        grid = new Script.VisualizeTileGrid(new ƒ.Vector3(0, 0, 0));
        root.addChild(grid);
        console.log(root);
        //setup Camera view
        const camera = new ƒ.ComponentCamera();
        console.log(camera);
        camera.mtxPivot.translateZ(-10);
        camera.mtxPivot.translateY(6);
        camera.mtxPivot.rotateX(25);
        //initialize the Viewport
        viewport.initialize("Viewport", root, camera, document.querySelector("canvas"));
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function run() {
        const eumlingData = Script.Provider.data.fights[0].entities;
        // rotate entities in first fight around because they're meant to be testing eumlings for now
        // TODO: remove this once this sort of testing is obsolete.
        [eumlingData[0][0], eumlingData[0][2]] = [eumlingData[0][2], eumlingData[0][0]];
        [eumlingData[1][0], eumlingData[1][2]] = [eumlingData[1][2], eumlingData[1][0]];
        [eumlingData[2][0], eumlingData[2][2]] = [eumlingData[2][2], eumlingData[2][0]];
        let eumlings = Script.initEntitiesInGrid(eumlingData, Script.Entity);
        eumlings.forEachElement((eumling) => {
            let visualizer = new Script.VisualizeEntity(eumling);
            root.addChild(visualizer);
        });
        console.log("Root: ", root);
        viewport.draw();
        // let tmp = eumlings.get([0, 0]);
        // eumlings.set([0, 0], eumlings.get([2, 0]));
        // eumlings.set([2, 0], tmp);
        // tmp = eumlings.get([0, 0]);
        // eumlings.set([0, 0], eumlings.get([2, 0]));
        // eumlings.set([2, 0], tmp);
        // tmp = eumlings.get([0, 0]);
        // eumlings.set([0, 0], eumlings.get([2, 0]));
        // eumlings.set([2, 0], tmp);
        let fightData = Script.Provider.data.fights[1];
        let fight = new Script.Fight(fightData, eumlings);
        console.log("Rounds: " + fight.getRounds());
        await fight.run();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Entity {
        #arena;
        constructor(_entity, _vis, _pos = [0, 0]) {
            this.resistancesSet = new Set();
            this.activeEffects = new Map();
            this.abilityEventListener = async (_ev) => {
                // this extra step seems pointless, but this way we can
                // overwrite `runAbility` in a derived class, which we can't do with
                // abilityEventListener.
                await this.runAbility(_ev);
            };
            this.endOfRoundEventListener = async (_ev) => {
                await this.handleEndOfTurn(_ev);
            };
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;
            // this.moves = _entity.moves instanceof ;
            if (_entity.moves)
                this.moves = "selection" in _entity.moves ? _entity.moves : { options: [_entity.moves], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.spells)
                this.spells = "selection" in _entity.spells ? _entity.spells : { options: [_entity.spells], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.attacks)
                this.attacks = "selection" in _entity.attacks ? _entity.attacks : { options: [_entity.attacks], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            this.abilities = _entity.abilities;
            this.resistances = _entity.resistances;
            this.resistancesSet = new Set(_entity.resistances);
            this.visualizer = _vis.getEntity(this);
        }
        getVisualizer() {
            return this.visualizer;
        }
        async damage(_amt, _critChance, _cause) {
            let wasCrit = false;
            if (_critChance > Math.random()) {
                _amt *= 2;
                wasCrit = true;
            }
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HURT_BEFORE, target: this, value: _amt, cause: _cause });
            this.currentHealth -= _amt;
            this.visualizer.hurt(_amt, wasCrit);
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HURT, target: this, cause: _cause });
            if (this.currentHealth <= 0) {
                //TODO this entity died, handle that.
            }
            return this.currentHealth;
        }
        async affect(_spell, _cause) {
            if (this.resistancesSet.has(_spell.type)) {
                // resisted this spell
                await this.visualizer.resist();
                return 0;
            }
            let value = this.activeEffects.get(_spell.type) ?? 0;
            value += _spell.level ?? 1;
            this.activeEffects.set(_spell.type, value);
            return value;
        }
        async move() {
            ;
        }
        async useSpell(_friendly, _opponent, _spells = this.select(this.spells, true), _targetsOverride) {
            for (let spell of _spells) {
                let targets = _targetsOverride ?? Script.getTargets(spell.target, _friendly, _opponent, this);
                await this.visualizer.spell(spell, targets);
                for (let target of targets) {
                    await target.affect(spell, this);
                }
            }
        }
        async useAttack(_friendly, _opponent, _attacks = this.select(this.attacks, true), _targetsOverride) {
            for (let attack of _attacks) {
                // get the target(s)
                let targets = _targetsOverride ?? Script.getTargets(attack.target, _friendly, _opponent, this);
                // execute the attacks
                await this.visualizer.attack(attack, targets);
                let attackDmg = this.getDamageOfAttacks([attack], true);
                for (let target of targets) {
                    await target.damage(attackDmg, attack.baseCritChance, this);
                }
            }
        }
        getOwnDamage() {
            const attacks = this.select(this.attacks, false);
            let total = this.getDamageOfAttacks(attacks, false);
            return total;
        }
        updateVisuals() {
            this.visualizer.updateVisuals();
        }
        select(_options, _use) {
            if (!_options)
                return [];
            const selection = [];
            if ("options" in _options) {
                if (!_options.selection.amount)
                    _options.selection.amount = Infinity;
                switch (_options.selection.order) {
                    case Script.SELECTION_ORDER.ALL:
                        _options.counter = 0;
                    case Script.SELECTION_ORDER.SEQUENTIAL:
                        if (!_options.counter)
                            _options.counter = 0;
                        for (let i = 0; i < _options.selection.amount && i < _options.options.length; i++) {
                            selection.push(_options.options[(i + _options.counter) % _options.options.length]);
                            _options.counter = (_options.counter + 1) % _options.options.length;
                        }
                        break;
                    case Script.SELECTION_ORDER.RANDOM_EACH_FIGHT:
                    case Script.SELECTION_ORDER.RANDOM_EACH_ROUND:
                }
                return selection;
            }
            return [_options];
        }
        getDamageOfAttacks(_attacks, _consumeEffects) {
            let weaknesses = this.activeEffects.get(Script.SPELL_TYPE.WEAKNESS) ?? 0;
            let strengths = this.activeEffects.get(Script.SPELL_TYPE.STRENGTH) ?? 0;
            let totalDamage = 0;
            for (let atk of _attacks) {
                let atkDmg = atk.baseDamage;
                if (strengths > 0) {
                    atkDmg *= 2;
                    strengths--;
                }
                if (weaknesses > 0) {
                    atkDmg = 0;
                    weaknesses--;
                }
                totalDamage += atkDmg;
            }
            if (_consumeEffects) {
                this.activeEffects.set(Script.SPELL_TYPE.WEAKNESS, weaknesses);
                this.activeEffects.set(Script.SPELL_TYPE.STRENGTH, strengths);
            }
            return totalDamage;
        }
        setGrids(_home, _away) {
            this.#arena = {
                home: _home,
                away: _away,
            };
        }
        registerEventListeners() {
            // register abilities
            let triggers = new Set(); // get all triggers first to avoid duplication
            if (this.abilities) {
                for (let ability of this.abilities) {
                    if (Array.isArray(ability.on)) {
                        for (let ev of ability.on) {
                            triggers.add(ev);
                        }
                    }
                    else {
                        triggers.add(ability.on);
                    }
                }
            }
            for (let trigger of triggers.values()) {
                Script.EventBus.addEventListener(trigger, this.abilityEventListener);
            }
            // register end of turn effects
            Script.EventBus.addEventListener(Script.EVENT.ROUND_END, this.endOfRoundEventListener);
        }
        async runAbility(_ev) {
            if (!this.abilities)
                return;
            nextAbility: for (let ability of this.abilities) {
                // correct type of event
                if (Array.isArray(ability.on)) {
                    if (!ability.on.includes(_ev.type))
                        continue;
                }
                else {
                    if (ability.on !== _ev.type)
                        continue;
                }
                // are conditions met?
                if (ability.conditions) {
                    let conditions = Array.isArray(ability.conditions) ? ability.conditions : [ability.conditions];
                    for (let condition of conditions) {
                        if (condition.target && this.#arena && _ev.target) {
                            let validTargets = Script.getTargets(condition.target, this.#arena.home, this.#arena.away, this);
                            if (!validTargets.includes(_ev.target))
                                continue nextAbility;
                        }
                        if (condition.cause && this.#arena && _ev.cause) {
                            let validTargets = Script.getTargets(condition.cause, this.#arena.home, this.#arena.away, this);
                            if (!validTargets.includes(_ev.cause))
                                continue nextAbility;
                        }
                        if (condition.value && _ev.value !== undefined) {
                            if (typeof condition.value === "number") {
                                if (condition.value !== _ev.value)
                                    continue nextAbility;
                            }
                            else {
                                let min = condition.value.min ?? -Infinity;
                                let max = condition.value.max ?? Infinity;
                                if (min > _ev.value || max < _ev.value)
                                    continue nextAbility;
                            }
                        }
                    }
                }
                // if we get here, we're ready to do the ability
                let targets = undefined;
                if (ability.target === "cause") {
                    if (_ev.cause)
                        targets = [_ev.cause];
                }
                else if (ability.target === "target") {
                    if (_ev.target)
                        targets = [_ev.target];
                }
                else {
                    targets = Script.getTargets(ability.target, this.#arena.home, this.#arena.away);
                }
                // no targets found, no need to do the ability
                if (!targets)
                    continue nextAbility;
                if (ability.attack) {
                    await this.useAttack(this.#arena.home, this.#arena.away, [{ target: undefined, ...ability.attack }], targets);
                }
                if (ability.spell) {
                    await this.useSpell(this.#arena.home, this.#arena.away, [{ target: undefined, ...ability.spell }], targets);
                }
            }
        }
        async handleEndOfTurn(_ev) {
            // take care of DOTs
            const relevantSpells = [Script.SPELL_TYPE.FIRE, Script.SPELL_TYPE.POISON];
            for (let spell of relevantSpells) {
                if (!this.activeEffects.has(spell))
                    continue;
                let value = this.activeEffects.get(spell);
                if (value <= 0)
                    continue;
                this.damage(value, 0);
                this.activeEffects.set(spell, --value);
            }
        }
    }
    Script.Entity = Entity;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Grid {
        constructor(_content = Grid.EMPTY()) {
            /*
            gotta rotate the grid because when entered like this:
                [[e1, e2, e3] <- x: 0
                 [e4, e4, e6] <- x: 1
                 [e7, e8, e9]]<- x: 2
                 y:0 y:1 y:2
                
            the IDs would be the opposite of what you expect through Position:
             [0, 0] [0, 1] [0, 2]
             [1, 0] [1, 1] [1, 2]
             [2, 0] [2, 1] [2, 2]

             thus, we're rotating it so it's more intuitive for the end user.
            */
            this.grid = Grid.EMPTY();
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    this.grid[x][y] = _content[y][x];
                }
            }
        }
        ;
        static EMPTY() {
            return [[, , ,], [, , ,], [, , ,]];
        }
        get(_pos) {
            if (this.outOfBounds(_pos))
                return undefined;
            return this.grid[_pos[0]][_pos[1]];
        }
        set(_pos, _el) {
            if (this.outOfBounds(_pos))
                return undefined;
            return this.grid[_pos[0]][_pos[1]] = _el;
        }
        forEachElement(callback) {
            for (let y = 0; y < 3; y++)
                for (let x = 0; x < 3; x++) {
                    callback(this.grid[x][y], [x, y]);
                }
        }
        async forEachElementAsync(callback) {
            for (let y = 0; y < 3; y++)
                for (let x = 0; x < 3; x++) {
                    await callback(this.grid[x][y], [x, y]);
                }
        }
        get occupiedSpots() {
            let total = 0;
            this.forEachElement((el) => {
                if (el)
                    total++;
            });
            return total;
        }
        outOfBounds(_pos) {
            return _pos[0] < 0 || _pos[0] > 2 || _pos[1] < 0 || _pos[1] > 2;
        }
    }
    Script.Grid = Grid;
})(Script || (Script = {}));
var Script;
(function (Script) {
    function initEntitiesInGrid(_grid, _entity) {
        const grid = new Script.Grid(_grid);
        const newGrid = new Script.Grid();
        const data = Script.Provider.data;
        grid.forEachElement((entityId, pos) => {
            if (!entityId)
                return;
            let entityData = data.getEntity(entityId);
            if (!entityData)
                throw new Error(`Entity ${entityId} not found.`);
            newGrid.set(pos, new _entity(entityData, Script.Provider.visualizer, pos));
        });
        console.log("init Grid: " + newGrid);
        return newGrid;
    }
    Script.initEntitiesInGrid = initEntitiesInGrid;
    async function waitMS(_ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        });
    }
    Script.waitMS = waitMS;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class VisualizeFightNull {
        #home;
        #away;
        constructor(_fight) {
            let awayGrid = new Script.Grid();
            _fight.arena.away.forEachElement((entity, pos) => awayGrid.set(pos, entity?.getVisualizer()));
            this.#away = new Script.VisualizeGridNull(awayGrid);
            let homeGrid = new Script.Grid();
            _fight.arena.home.forEachElement((entity, pos) => homeGrid.set(pos, entity?.getVisualizer()));
            this.#home = new Script.VisualizeGridNull(homeGrid);
        }
        async showGrid() {
            let grid = [[, , , , , , ,], [], []];
            this.#home.grid.forEachElement((el, pos) => {
                if (!el)
                    return;
                let entity = el.getEntity();
                grid[pos[1]][2 - pos[0]] = `${entity.id}\n${entity.currentHealth} ♥️`;
            });
            this.#away.grid.forEachElement((el, pos) => {
                if (!el)
                    return;
                let entity = el.getEntity();
                grid[pos[1]][pos[0] + 4] = `${entity.id}\n${entity.currentHealth} ♥️`;
            });
            console.table(grid);
        }
        async fightStart() {
            console.log("Fight Start!");
            await this.showGrid();
        }
        async roundStart() {
            console.log("Round Start!");
        }
        async roundEnd() {
            await this.showGrid();
            console.log("Round End");
        }
        async fightEnd() {
            console.log("Fight End!");
        }
    }
    Script.VisualizeFightNull = VisualizeFightNull;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizeEntity extends ƒ.Node /*implements VisualizeEntity*/ {
        //private grid: VisualizeGridNull;
        //create a mesh and material for the tile
        static { this.mesh = new ƒ.MeshCube("EntityMesh"); }
        static { this.material = new ƒ.Material("EntityMat", ƒ.ShaderLitTextured); }
        constructor(_entity) {
            super("entity");
            this.size = 0.5;
            this.entity = _entity;
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(VisualizeEntity.mesh));
            this.addComponent(new ƒ.ComponentMaterial(VisualizeEntity.material));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(new ƒ.Vector3(this.size));
        }
        async idle() {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
            await Script.waitMS(200);
        }
        async attack(_attack, _targets) {
            console.log("entity visualizer null: attack", { attacker: this.entity, attack: _attack, targets: _targets });
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("blue");
            await Script.waitMS(200);
        }
        async move(_move) {
            //TODO: add movement logic here
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3());
            console.log("entity visualizer null: move", _move);
            await Script.waitMS(200);
        }
        async hurt(_damage, _crit) {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("red");
            await Script.waitMS(200);
        }
        async spell(_spell, _targets) {
            console.log("entity visualizer null: spell", { caster: this.entity, spell: _spell, targets: _targets });
            await Script.waitMS(200);
        }
        async showPreview() {
            console.log("entity visualizer null: show preview", this.entity);
            await Script.waitMS(200);
        }
        async hidePreview() {
            console.log("entity visualizer null: hide preview", this.entity);
            await Script.waitMS(200);
        }
        async updateVisuals() {
            // console.log("entity visualizer null: updateVisuals", this.entity);
            // await waitMS(200);
        }
        async resist() {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("gray");
            console.log("entity visualizer null: resisting", this.entity);
            await Script.waitMS(200);
        }
        getEntity() {
            return this.entity;
        }
    }
    Script.VisualizeEntity = VisualizeEntity;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class VisualizeEntityNull {
        #entity;
        constructor(_entity) { this.#entity = _entity; }
        async attack(_attack, _targets) {
            console.log("entity visualizer null: attack", { attacker: this.#entity, attack: _attack, targets: _targets });
            await Script.waitMS(200);
        }
        async move(_move) {
            console.log("entity visualizer null: move", _move);
            await Script.waitMS(200);
        }
        async hurt(_damage, _crit) {
            console.log("entity visualizer null: hurt", { hurtEntity: this.#entity, damage: _damage, wasCrit: _crit });
            await Script.waitMS(200);
        }
        async spell(_spell, _targets) {
            console.log("entity visualizer null: spell", { caster: this.#entity, spell: _spell, targets: _targets });
            await Script.waitMS(200);
        }
        async showPreview() {
            console.log("entity visualizer null: show preview", this.#entity);
            await Script.waitMS(200);
        }
        async hidePreview() {
            console.log("entity visualizer null: hide preview", this.#entity);
            await Script.waitMS(200);
        }
        async updateVisuals() {
            // console.log("entity visualizer null: updateVisuals", this.#entity);
            // await waitMS(200);
        }
        async resist() {
            console.log("entity visualizer null: resisting", this.#entity);
            await Script.waitMS(200);
        }
        getEntity() {
            return this.#entity;
        }
    }
    Script.VisualizeEntityNull = VisualizeEntityNull;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizeTile extends ƒ.Node {
        //create a mesh and material for the tile
        static { this.mesh = new ƒ.MeshCube("TileMesh"); }
        static { this.material = new ƒ.Material("TileMat", ƒ.ShaderLitTextured); }
        constructor(_name, _size, _pos) {
            super(_name);
            this.size = _size;
            this.pos = _pos;
            const tileMesh = new ƒ.ComponentMesh(VisualizeTile.mesh);
            tileMesh.mtxPivot.scale(new ƒ.Vector3(this.size, 0.001, this.size));
            tileMesh.mtxPivot.translate(this.pos);
            tileMesh.mtxPivot.rotateZ(90);
            //const sphere: ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshSphere("Tile"));
            const tileMat = new ƒ.ComponentMaterial(VisualizeTile.material);
            tileMat.clrPrimary.setCSS("white");
            this.addComponent(tileMesh);
            this.addComponent(tileMat);
            this.addComponent(new ƒ.ComponentTransform());
        }
    }
    Script.VisualizeTile = VisualizeTile;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizeTileGrid extends ƒ.Node {
        constructor(_position) {
            super("VisualizeGrid");
            this.position = _position;
            this.tiles = 9; //3x3
            this.tileSize = 1;
            this.spacing = 0.4; //large values = smaller spacing between 0 and 0.5
            this.offset = 0.5;
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(this.position);
            this.generateGrid();
        }
        //create a grid with 2 Sides: home | away
        //each having a 3x3 grid of tiles
        generateGrid() {
            let home = new ƒ.Node("home");
            let away = new ƒ.Node("away");
            home.addComponent(new ƒ.ComponentTransform);
            away.addComponent(new ƒ.ComponentTransform);
            //create the tile grid for each side
            this.layoutGrid(home, 1);
            this.layoutGrid(away, -1);
            //add the sides as children to the grid Object
            this.addChild(home);
            this.addChild(away);
        }
        //TODO: consider world position or relative position?
        getTilePosition(_index, _side) {
            let i = _index;
            if (_side === "home") {
                let x = i % 3;
                let z = Math.floor(i / 3);
                return new ƒ.Vector3(x, 0, z);
            }
            else if (_side === "away") {
                let x = -(i % 3);
                let z = Math.floor(i / 3);
                return new ƒ.Vector3(x, 0, z);
            }
            else {
                throw new Error("Invalide side. Expected 'home' or 'away'.");
            }
        }
        //Layout the tiles in a grid with a given direction and add them as childs to the given parent node
        layoutGrid(_parent, direction = 1) {
            for (let i = 0; i < this.tiles; i++) {
                let x = i % 3;
                let z = Math.floor(i / 3);
                let tilePos = new ƒ.Vector3(direction * (this.offset + x * (this.tileSize - this.spacing)), 0, z * (this.tileSize - this.spacing));
                let tile = new Script.VisualizeTile(`Tile_${i}: ${x}, ${z}`, this.tileSize, tilePos);
                tile.getComponent(ƒ.ComponentTransform).mtxLocal.translate(tilePos);
                _parent.addChild(tile);
            }
        }
    }
    Script.VisualizeTileGrid = VisualizeTileGrid;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizeGridNull extends ƒ.Node {
        constructor(_grid) {
            super("VisualizeGridNull");
            this.grid = _grid;
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3(0));
        }
        updateVisuals() {
            this.grid.forEachElement((element) => {
                element?.updateVisuals();
            });
        }
        getRealPosition(_pos) {
            return _pos;
        }
    }
    Script.VisualizeGridNull = VisualizeGridNull;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map