"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var Script;
(function (Script) {
    let EVENT;
    (function (EVENT) {
        EVENT["RUN_START"] = "runStart";
        EVENT["RUN_END"] = "runEnd";
        EVENT["FIGHT_PREPARE"] = "fightPrepare";
        EVENT["FIGHT_PREPARE_COMPLETED"] = "fightPrepareCompleted";
        EVENT["FIGHT_START"] = "fightStart";
        EVENT["FIGHT_END"] = "fightEnd";
        EVENT["FIGHT_ENDED"] = "fightEnded";
        EVENT["ROUND_START"] = "roundStart";
        EVENT["ROUND_END"] = "roundEnd";
        EVENT["ENTITY_SPELL_BEFORE"] = "entitySpellBefore";
        EVENT["ENTITY_SPELL"] = "entitySpell";
        EVENT["ENTITY_ATTACK"] = "entityAttack";
        EVENT["ENTITY_ATTACKED"] = "entityAttacked";
        EVENT["ENTITY_HEAL"] = "entityHeal";
        EVENT["ENTITY_HEALED"] = "entityHealed";
        EVENT["ENTITY_AFFECT"] = "entityAffect";
        EVENT["ENTITY_AFFECTED"] = "entityAffected";
        EVENT["ENTITY_HURT_BEFORE"] = "entityHurtBefore";
        EVENT["ENTITY_HURT"] = "entityHurt";
        EVENT["ENTITY_DIES"] = "entityDies";
        EVENT["ENTITY_DIED"] = "entityDied";
        // ENTITY_CREATE = "entityCreate", // unused
        // ENTITY_CREATED = "entityCreated", // unused
        EVENT["ENTITY_MOVE"] = "entityMove";
        EVENT["ENTITY_MOVED"] = "entityMoved";
        EVENT["TRIGGER_ABILITY"] = "triggerAbility";
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
            const listeners = [...this.listeners.get(_ev.type)]; // copying this so removing listeners doesn't skip any
            for (let listener of listeners) {
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
    /**Move the Entity based of the Grid Data then map the position to the empty nodes in the Graph with a mapping function
     * this could also be done in the Visualizer with a function like mapPositionToNode(_pos: Position)
    */
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
        TARGET.SELF = { area: { position: Script.AREA_POSITION.RELATIVE_MIRRORED, shape: Script.AREA_SHAPE.SINGLE }, side: TARGET_SIDE.ALLY };
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
                if (entity && !entity.untargetable)
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
                        new Script.Grid(_target.area.pattern).forEachPosition((element, pos) => {
                            pattern.set(pos, !!element);
                        });
                    }
                }
            }
            if (patternIsRelative && (pos[0] !== 1 || pos[1] !== 1)) {
                // 1, 1 is the center, so the difference to that is how much the pattern is supposed to be moved
                let delta = [pos[0] - 1, pos[1] - 1];
                let movedPattern = new Script.Grid();
                pattern.forEachPosition((el, pos) => {
                    let newPos = [pos[0] + delta[0], pos[1] + delta[1]];
                    movedPattern.set(newPos, !!el);
                });
                pattern = movedPattern;
            }
            // final pattern achieved, get the actual entities in these areas now
            side.forEachElement((el, pos) => {
                if (el.untargetable)
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
        /** Heals the target by the specified amount. */
        SPELL_TYPE["HEAL"] = "health";
        /** Entity cannot be targeted for this round */
        SPELL_TYPE["UNTARGETABLE"] = "untargetable";
        // negative
        /** Takes double damage from next attack. Max 1 used per attack */
        SPELL_TYPE["VULNERABLE"] = "vulnerable";
        /** Next attack doesn't deal any damage. Max 1 used per attack */
        SPELL_TYPE["WEAKNESS"] = "weakness";
        /** Deals 1 damage at the end of the round per poison stack. Removes 1 per round. */
        SPELL_TYPE["POISON"] = "poison";
        /** Deals 1 damage at the end of the round. Removes 1 per round. */
        SPELL_TYPE["FIRE"] = "fire";
        /** Entity cannot act at all this turn */
        SPELL_TYPE["STUN"] = "stun";
        // not fight related
        // GOLD = "gold",
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
                id: "R-Eumling",
                health: 3,
                attacks: {
                    baseDamage: 1,
                    target: {
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW,
                            shape: Script.AREA_SHAPE.SINGLE,
                        },
                    }
                }
            },
            {
                id: "S-Eumling",
                health: 4,
                spells: {
                    target: Script.TARGET.SELF,
                    type: Script.SPELL_TYPE.HEAL,
                    level: 1,
                },
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
                id: "boxingBush", // enemy that attacks the entire mirrored column for 1
                health: 2,
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
                id: "punchingPalmtree", // enemy that attacks everywhere but the center
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
                id: "sandSitter", // enemy that attacks a plus, but spawns in round 2 (not implemented yet)
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
            },
            {
                id: "countdownCoconut", // coconut that blows up on the final turn
                health: 2,
                abilities: [
                    {
                        on: Script.EVENT.ROUND_END,
                        target: {
                            area: {
                                position: Script.AREA_POSITION.ABSOLUTE,
                                absolutePosition: [1, 1],
                                shape: Script.AREA_SHAPE.PATTERN,
                                pattern: [
                                    [1, 1, 1,],
                                    [1, 1, 1,],
                                    [1, 1, 1,]
                                ]
                            },
                            side: Script.TARGET_SIDE.OPPONENT,
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
                    ["defaultSkin", , ,],
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
            },
            {
                //test entity visualizer with models
                rounds: 3,
                entities: [
                    ["kacki", "Björn", "kacki",],
                    ["kacki", "kacki", "kacki",],
                    ["kacki", "kacki", "kacki",]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    ["boxingBush", , ,],
                    [, "boxingBush", ,],
                    [, , "boxingBush",]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, , ,],
                    [, "flameFlinger", "punchingPalmtree",],
                    [, , ,]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    ["flameFlinger", , ,],
                    [, "sandSitter", "boxingBush",],
                    ["flameFlinger", , ,]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, "flameFlinger", ,],
                    ["flameFlinger", "punchingPalmtree", "flameFlinger",],
                    [, "flameFlinger", ,]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, , "flameFlinger",],
                    [, "sandSitter", ,],
                    ["boxingBush", , "flameFlinger",]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, "punchingPalmtree", ,],
                    ["boxingBush", , ,],
                    [, "punchingPalmtree", ,]
                ],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    [, , "punchingPalmtree",],
                    ["worriedWall", "countdownCoconut", ,],
                    [, , ,]
                ],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    ["worriedWall", , "cactusCrawler",],
                    [, "cactusCrawler", ,],
                    ["cactusCrawler", "worriedWall", ,]
                ],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    ["cactusCrawler", , "sandSitter",],
                    [, , ,],
                    [, "cactusCrawler", "sandSitter",]
                ],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["worriedWall", "boxingBush", "sandSitter",],
                    ["worriedWall", "cactusCrawler", "countdownCoconut",],
                    [, , ,]
                ],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["boxingBush", , "flameFlinger",],
                    ["cactusCrawler", "sandSitter", ,],
                    ["flameFlinger", , "boxingBush",]
                ],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["cactusCrawler", "countdownCoconut", "cactusCrawler",],
                    [, "cactusCrawler", ,],
                    ["cactusCrawler", , "countdownCoconut",]
                ],
            },
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
            this.data.stones = Script.DataContent.stones;
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
        get stones() {
            return this.data.stones;
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
    let FIGHT_RESULT;
    (function (FIGHT_RESULT) {
        FIGHT_RESULT["WIN"] = "win";
        FIGHT_RESULT["SURVIVE"] = "survive";
        FIGHT_RESULT["DEFEAT"] = "defeat";
    })(FIGHT_RESULT = Script.FIGHT_RESULT || (Script.FIGHT_RESULT = {}));
    class Fight {
        constructor(_fight, _home) {
            this.handleDeadEntity = async (_ev) => {
                let deadEntity = _ev.target;
                this.arena.home.forEachElement((el, pos) => {
                    if (el !== deadEntity)
                        return;
                    this.arena.home.set(pos, undefined);
                });
                this.arena.away.forEachElement((el, pos) => {
                    if (el !== deadEntity)
                        return;
                    this.arena.away.set(pos, undefined);
                });
            };
            this.rounds = _fight.rounds;
            this.arena = {
                away: Script.initEntitiesInGrid(_fight.entities, Script.Entity),
                home: _home,
            };
            this.arena.home.forEachElement((el) => {
                el.setGrids(this.arena.home, this.arena.away);
            });
            this.arena.away.forEachElement((el) => {
                el.setGrids(this.arena.away, this.arena.home);
            });
            this.visualizer = Script.Provider.visualizer.getFight(this);
            this.HUD = Script.Provider.visualizer.getHUD();
            this.addEventListeners();
        }
        getRounds() {
            return this.rounds;
        }
        async run() {
            Fight.activeFight = this;
            // Eventlisteners
            // EventBus.removeAllEventListeners();
            this.HUD.addFightListeners(); //replace main.ts instance with Provider.visualizer.getHUD() instance
            this.arena.home.forEachElement((el) => { el.registerEventListeners(); });
            this.arena.away.forEachElement((el) => { el.registerEventListeners(); });
            //TODO: Add stones
            await this.visualizer.fightStart();
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_START });
            // run actual round
            for (let r = 0; r < this.rounds; r++) {
                await this.visualizer.roundStart();
                await Script.waitMS(2000);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ROUND_START, detail: { round: r } });
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ROUND_END, detail: { round: r } });
                await this.visualizer.roundEnd();
                // check if round is over
                if (this.arena.home.occupiedSpots === 0) {
                    return await this.fightEnd(FIGHT_RESULT.DEFEAT);
                }
                if (this.arena.away.occupiedSpots === 0) {
                    return await this.fightEnd(FIGHT_RESULT.WIN);
                }
            }
            return await this.fightEnd(FIGHT_RESULT.SURVIVE);
        }
        async fightEnd(_result) {
            await this.visualizer.fightEnd();
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_END, detail: { result: _result } });
            Fight.activeFight = undefined;
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_ENDED, detail: { result: _result } });
            this.removeEventListeners();
            return _result;
        }
        async runOneSide(_active, _passive) {
            // TODO: moves
            // spells
            await _active.forEachElementAsync(async (el) => {
                await el.useSpell(_active, _passive);
            });
            // attacks
            await _active.forEachElementAsync(async (el) => {
                await el.useAttack(_active, _passive);
            });
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_DIED, this.handleDeadEntity);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_DIED, this.handleDeadEntity);
        }
    }
    Script.Fight = Fight;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizerNull {
        constructor() {
            this.root = new ƒ.Node("Root");
        }
        getEntity(_entity) {
            return new Script.VisualizeEntity(_entity);
        }
        getFight(_fight) {
            return new Script.VisualizeFightNull(_fight);
        }
        getHUD() {
            return new Script.VisualizeHUD();
        }
        initializeScene(_viewport) {
            this.viewport = _viewport;
            let HUD = new Script.VisualizeHUD();
            HUD.sayHello(); // TODO remove this!
            console.log(this.root);
            let FigthScene = ƒ.Project.getResourcesByName("FightScene")[0];
            //attach the root node to the FightScene
            this.camera = FigthScene.getChildByName("CameraRotator").getChildByName("Camera_Wrapper").getChildByName("Cam").getComponent(ƒ.ComponentCamera);
            FigthScene.addChild(this.root);
            _viewport.initialize("Viewport", FigthScene, this.camera, document.querySelector("canvas"));
            _viewport.draw();
        }
        addToScene(_el) {
            this.root.addChild(_el);
            //console.log("Root: " + this.root);
        }
        getCamera() {
            return this.camera;
        }
        getRoot() {
            return this.root;
        }
        getGraph() {
            return this.viewport.getBranch();
        }
        drawScene() {
            this.viewport.draw();
        }
    }
    Script.VisualizerNull = VisualizerNull;
})(Script || (Script = {}));
var Script;
(function (Script) {
    // TODO: add Provider to pass UI elements without hardcoding???
    class VisualizeHUD {
        constructor() {
            this.roundStart = async (_ev) => {
                this.updateRoundCounter(_ev);
            };
        }
        sayHello() {
            console.log("Hello from HUD");
        }
        updateRoundCounter(_ev) {
            let round = _ev.detail.round;
            const roundCounter = document.querySelector(".RoundCounter");
            roundCounter.innerText = `Round: ${round + 1}`;
            console.log(`Update Round: ${round + 1}`);
        }
        addFightListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ROUND_START, this.roundStart);
        }
    }
    Script.VisualizeHUD = VisualizeHUD;
})(Script || (Script = {}));
/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeHUD.ts" />
var Script;
/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeHUD.ts" />
(function (Script) {
    class Provider {
        static #data = new Script.Data();
        static #visualizer = new Script.VisualizerNull();
        static #HUD = new Script.VisualizeHUD();
        static get data() {
            return this.#data;
        }
        static get visualizer() {
            return this.#visualizer;
        }
        static get HUD() {
            return this.#HUD;
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
/// <reference path="Visualisation/UI/VisualizeHUD.ts"/>
var Script;
/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />
/// <reference path="Visualisation/UI/VisualizeHUD.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    ƒ.Debug.info("Main Program Template running!");
    let visualizer;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    async function initProvider() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR)
            return;
        await Script.Provider.data.load();
        //TODO load correct visualizer here
        run();
    }
    function start(_event) {
        viewport = _event.detail;
        initProvider();
        visualizer = Script.Provider.visualizer;
        visualizer.initializeScene(viewport);
        visualizer.drawScene();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function run() {
        // const eumlingData = Provider.data.fights[0].entities;
        // rotate entities in first fight around because they're meant to be testing eumlings for now
        // TODO: remove this once this sort of testing is obsolete.
        // [eumlingData[0][0], eumlingData[0][2]] = [eumlingData[0][2], eumlingData[0][0]];
        // [eumlingData[1][0], eumlingData[1][2]] = [eumlingData[1][2], eumlingData[1][0]];
        // [eumlingData[2][0], eumlingData[2][2]] = [eumlingData[2][2], eumlingData[2][0]];
        // let eumlings: Grid<IEntity> = initEntitiesInGrid(eumlingData, Entity);
        // eumlings.forEachElement((eumling) => {
        //   let visualizer = new VisualizeEntity(eumling);
        //   root.addChild(visualizer);
        // });
        // console.log("Root: ", root);
        // viewport.draw();
        // let tmp = eumlings.get([0, 0]);
        // eumlings.set([0, 0], eumlings.get([2, 0]));
        // eumlings.set([2, 0], tmp);
        // tmp = eumlings.get([0, 0]);
        // eumlings.set([0, 0], eumlings.get([2, 0]));
        // eumlings.set([2, 0], tmp);
        // tmp = eumlings.get([0, 0]);
        // eumlings.set([0, 0], eumlings.get([2, 0]));
        // eumlings.set([2, 0], tmp);
        // visualizer.drawScene();
        // let fightData = Provider.data.fights[3];
        // let fight = new Fight(fightData, eumlings);
        // console.log("Rounds: " + fight.getRounds());
        // await fight.run();
        const run = new Script.Run();
        await run.start();
        console.log("run over");
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let DataLink = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.ComponentScript;
        let _id_decorators;
        let _id_initializers = [];
        let _id_extraInitializers = [];
        var DataLink = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _id_decorators = [ƒ.serialize(String)];
                __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                DataLink = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.linkedNodes = new Map(); }
            constructor() {
                super();
                this.id = __runInitializers(this, _id_initializers, void 0);
                __runInitializers(this, _id_extraInitializers);
                if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                    return;
                ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, () => {
                    if (this.node instanceof ƒ.Graph)
                        DataLink.linkedNodes.set(this.id, this.node);
                });
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return DataLink = _classThis;
    })();
    Script.DataLink = DataLink;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let DataContent;
    (function (DataContent) {
        DataContent.stones = [
            {
                id: "healstone",
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.HEAL, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: Script.SPELL_TYPE.HEAL, level: 1 }
                    }
                ]
            },
            {
                id: "shieldstone",
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 2 }
                    }
                ]
            },
            {
                id: "brick",
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: Script.AREA_SHAPE.ROW, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: Script.AREA_SHAPE.ROW, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 2 }
                    }
                ]
            }
        ];
    })(DataContent = Script.DataContent || (Script.DataContent = {}));
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Entity {
        #arena;
        #triggers;
        constructor(_entity, _pos = [0, 0]) {
            this.resistancesSet = new Set();
            this.activeEffects = new Map();
            this.#triggers = new Set();
            this.abilityEventListener = async (_ev) => {
                // this extra step seems pointless, but this way we can
                // overwrite `runAbility` in a derived class, which we can't do with
                // abilityEventListener.
                await this.runAbility(_ev);
            };
            this.endOfRoundEventListener = async (_ev) => {
                await this.handleEndOfTurn(_ev);
            };
            this.endOfFightEventListener = async (_ev) => {
                await this.handleEndOfFight(_ev);
            };
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            this.position = _pos;
            this.updateEntityData(_entity);
        }
        get untargetable() {
            if (this.activeEffects.get(Script.SPELL_TYPE.UNTARGETABLE) > 0) {
                return true;
            }
            return false;
        }
        get stunned() {
            if (this.activeEffects.get(Script.SPELL_TYPE.STUN) > 0) {
                return true;
            }
            return false;
        }
        updateEntityData(_newData) {
            this.id = _newData.id;
            let healthDifference = (_newData.health ?? 1) - (this.health ?? 0);
            this.currentHealth = (this.health ?? 0) + healthDifference;
            this.health = _newData.health ?? 1;
            if (_newData.moves)
                this.moves = "selection" in _newData.moves ? _newData.moves : { options: [_newData.moves], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            if (_newData.spells)
                this.spells = "selection" in _newData.spells ? _newData.spells : { options: [_newData.spells], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            if (_newData.attacks)
                this.attacks = "selection" in _newData.attacks ? _newData.attacks : { options: [_newData.attacks], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            this.abilities = _newData.abilities;
            this.resistances = _newData.resistances;
            this.resistancesSet = new Set(_newData.resistances);
        }
        async damage(_amt, _critChance, _cause) {
            if (this.untargetable) {
                return this.health;
            }
            let wasCrit = false;
            let amount = _amt;
            // mirror
            if (this.activeEffects.has(Script.SPELL_TYPE.MIRROR) && _cause) {
                let mirrors = Math.max(0, this.activeEffects.get(Script.SPELL_TYPE.MIRROR));
                if (mirrors > 0) {
                    await _cause.damage(_amt, _critChance, this);
                    mirrors--;
                    this.setEffectLevel(Script.SPELL_TYPE.MIRROR, mirrors);
                    // TODO: Event for mirror effect?
                    return this.currentHealth;
                }
                this.activeEffects.set(Script.SPELL_TYPE.MIRROR, 0);
            }
            // crit
            if (_critChance > Math.random()) {
                amount *= 2;
                wasCrit = true;
            }
            // vulnerable
            if (this.activeEffects.has(Script.SPELL_TYPE.VULNERABLE)) {
                let vulnerable = Math.max(0, this.activeEffects.get(Script.SPELL_TYPE.VULNERABLE));
                if (vulnerable > 0) {
                    amount *= 2;
                    vulnerable--;
                }
                this.setEffectLevel(Script.SPELL_TYPE.VULNERABLE, vulnerable);
            }
            // shields
            if (this.activeEffects.has(Script.SPELL_TYPE.SHIELD)) {
                let shields = Math.max(0, this.activeEffects.get(Script.SPELL_TYPE.SHIELD));
                while (amount > 0 && shields > 0) {
                    amount--;
                    shields--;
                }
                // TODO: Event for breaking shields? Or maybe event for triggering effect in general?
                this.setEffectLevel(Script.SPELL_TYPE.SHIELD, shields);
            }
            // thorns
            if (this.activeEffects.has(Script.SPELL_TYPE.THORNS) && _cause) {
                let thorns = Math.max(0, this.activeEffects.get(Script.SPELL_TYPE.THORNS));
                if (thorns > 0) {
                    await _cause.damage(thorns, 0, this);
                }
                this.setEffectLevel(Script.SPELL_TYPE.THORNS, 0);
            }
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HURT_BEFORE, target: this, detail: { amount, crit: wasCrit }, cause: _cause });
            this.currentHealth -= amount;
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HURT, target: this, cause: _cause, detail: { amount, crit: wasCrit } });
            if (this.currentHealth <= 0) {
                //this entity died
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_DIES, target: this, cause: _cause, detail: { amount } });
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_DIED, target: this, cause: _cause, detail: { amount } });
            }
            return this.currentHealth;
        }
        async affect(_spell, _cause) {
            if (this.untargetable) {
                return undefined;
            }
            if (this.resistancesSet.has(_spell.type)) {
                // resisted this spell
                // TODO: dispatch event
                return 0;
            }
            const instantEffects = new Set([Script.SPELL_TYPE.HEAL]);
            let amount = _spell.level ?? 1;
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_AFFECT, detail: { level: amount }, trigger: _spell, target: this, cause: _cause });
            if (!instantEffects.has(_spell.type)) {
                let value = this.activeEffects.get(_spell.type) ?? 0;
                value += amount;
                this.activeEffects.set(_spell.type, value);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_AFFECTED, detail: { level: amount }, trigger: _spell, target: this, cause: _cause });
                return value;
            }
            switch (_spell.type) {
                case Script.SPELL_TYPE.HEAL: {
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HEAL, detail: { level: amount }, trigger: _spell, target: this, cause: _cause });
                    // TODO: call Visualizer
                    // TODO: prevent overheal?
                    this.currentHealth += amount;
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HEALED, detail: { level: amount }, trigger: _spell, target: this, cause: _cause });
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_AFFECTED, detail: { level: amount }, trigger: _spell, target: this, cause: _cause });
                    break;
                }
            }
            return 0;
        }
        async setEffectLevel(_spell, value) {
            if (value > 0) {
                this.activeEffects.set(_spell, value);
            }
            else {
                this.activeEffects.delete(_spell);
            }
        }
        async move() {
            //TODO: add movement logic here
            ;
        }
        async useSpell(_friendly, _opponent, _spells = this.select(this.spells, true), _targetsOverride) {
            if (!_spells)
                return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            for (let spell of _spells) {
                let targets = _targetsOverride ?? Script.getTargets(spell.target, _friendly, _opponent, this);
                for (let target of targets) {
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_SPELL_BEFORE, trigger: spell, cause: this, target });
                    await target.affect(spell, this);
                    await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_SPELL, trigger: spell, cause: this, target });
                }
            }
        }
        async useAttack(_friendly, _opponent, _attacks = this.select(this.attacks, true), _targetsOverride) {
            if (!_attacks || _attacks.length === 0)
                return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            for (let attack of _attacks) {
                // get the target(s)
                let targets = _targetsOverride ?? Script.getTargets(attack.target, _friendly, _opponent, this);
                // execute the attacks
                let attackDmg = this.getDamageOfAttacks([attack], true);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_ATTACK, cause: this, target: this, trigger: attack, detail: { damage: attackDmg, targets } });
                for (let target of targets) {
                    await target.damage(attackDmg, attack.baseCritChance, this);
                }
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_ATTACKED, cause: this, target: this, trigger: attack, detail: { damage: attackDmg, targets } });
            }
        }
        getOwnDamage() {
            const attacks = this.select(this.attacks, false);
            let total = this.getDamageOfAttacks(attacks, false);
            return total;
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
                this.setEffectLevel(Script.SPELL_TYPE.WEAKNESS, weaknesses);
                this.setEffectLevel(Script.SPELL_TYPE.STRENGTH, strengths);
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
            this.#triggers = new Set(); // get all triggers first to avoid duplication
            if (this.abilities) {
                for (let ability of this.abilities) {
                    if (Array.isArray(ability.on)) {
                        for (let ev of ability.on) {
                            this.#triggers.add(ev);
                        }
                    }
                    else {
                        this.#triggers.add(ability.on);
                    }
                }
            }
            for (let trigger of this.#triggers.values()) {
                Script.EventBus.addEventListener(trigger, this.abilityEventListener);
            }
            // register end of turn effects
            Script.EventBus.addEventListener(Script.EVENT.ROUND_END, this.endOfRoundEventListener);
            // register end of fight effects
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_END, this.endOfFightEventListener);
        }
        removeEventListeners() {
            for (let trigger of this.#triggers.values()) {
                Script.EventBus.removeEventListener(trigger, this.abilityEventListener);
            }
            Script.EventBus.removeEventListener(Script.EVENT.ROUND_END, this.endOfRoundEventListener);
            Script.EventBus.removeEventListener(Script.EVENT.FIGHT_END, this.endOfFightEventListener);
        }
        async runAbility(_ev) {
            if (!this.abilities)
                return;
            for (let ability of this.abilities) {
                Script.executeAbility.call(this, ability, this.#arena, _ev);
            }
        }
        async handleEndOfTurn(_ev) {
            // take care of DOTs
            const relevantSpells = [Script.SPELL_TYPE.FIRE, Script.SPELL_TYPE.POISON, Script.SPELL_TYPE.STUN, Script.SPELL_TYPE.UNTARGETABLE];
            const damagingSpells = [Script.SPELL_TYPE.FIRE, Script.SPELL_TYPE.POISON];
            for (let spell of relevantSpells) {
                if (!this.activeEffects.has(spell))
                    continue;
                let value = this.activeEffects.get(spell);
                if (value > 0) {
                    if (damagingSpells.includes(spell)) {
                        await this.damage(value, 0);
                    }
                }
                this.setEffectLevel(spell, --value);
            }
        }
        async handleEndOfFight(_ev) {
            this.activeEffects.clear();
            this.removeEventListeners();
        }
    }
    Script.Entity = Entity;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Eumling extends Script.Entity {
        #types = [];
        constructor(_startType) {
            _startType = _startType.trim().toUpperCase();
            const data = Script.Provider.data.getEntity(_startType + "-Eumling");
            if (!data)
                throw new Error("Tried to create an unknown Eumling type: " + _startType);
            super(data);
            this.#types = _startType.split("");
        }
        get types() {
            return this.#types;
        }
        addType(_type) {
            if (this.#types.length === 3)
                throw new Error("Eumling already has 3 types, can't add more.");
            if (_type.length !== 1)
                throw new Error("Only one type can be added at a time.");
            _type = _type.toUpperCase();
            let newType = this.#types.join("") + _type + "-Eumling";
            let newData = Script.Provider.data.getEntity(newType);
            if (!newData)
                throw new Error("Tried to create an invalid eumling: " + newType);
            this.updateEntityData(newData);
            this.removeEventListeners();
            this.registerEventListeners();
        }
    }
    Script.Eumling = Eumling;
})(Script || (Script = {}));
var Script;
(function (Script) {
    function areAbilityConditionsMet(_ability, _arena, _ev) {
        if (!_ability.conditions)
            return true;
        let conditions = Array.isArray(_ability.conditions) ? _ability.conditions : [_ability.conditions];
        for (let condition of conditions) {
            if (condition.target && _arena && _ev.target) {
                let validTargets = Script.getTargets(condition.target, _arena.home, _arena.away, this);
                if (!validTargets.includes(_ev.target))
                    return false;
            }
            if (condition.cause && _arena && _ev.cause) {
                let validTargets = Script.getTargets(condition.cause, _arena.home, _arena.away, this);
                if (!validTargets.includes(_ev.cause))
                    return false;
            }
            let level = _ev.detail.level;
            if (condition.value && level !== undefined) {
                if (typeof condition.value === "number") {
                    if (condition.value !== level)
                        return false;
                }
                else {
                    let min = condition.value.min ?? -Infinity;
                    let max = condition.value.max ?? Infinity;
                    if (min > level || max < level)
                        return false;
                }
            }
        }
        return true;
    }
    Script.areAbilityConditionsMet = areAbilityConditionsMet;
    async function executeAbility(_ability, _arena, _ev) {
        if (!_ability || !_ev)
            return;
        // correct type of event
        if (Array.isArray(_ability.on)) {
            if (!_ability.on.includes(_ev.type))
                return;
        }
        else {
            if (_ability.on !== _ev.type)
                return;
        }
        if (!areAbilityConditionsMet(_ability, _arena, _ev))
            return;
        // if we get here, we're ready to do the ability
        let targets = undefined;
        if (_ability.target === "cause") {
            if (_ev.cause)
                targets = [_ev.cause];
        }
        else if (_ability.target === "target") {
            if (_ev.target)
                targets = [_ev.target];
        }
        else {
            targets = Script.getTargets(_ability.target, _arena.home, _arena.away, this);
        }
        // no targets found, no need to do the ability
        if (!targets || targets.length === 0)
            return;
        await Script.EventBus.dispatchEvent({ type: Script.EVENT.TRIGGER_ABILITY, cause: this, target: this, trigger: _ability });
        if (_ability.attack) {
            await this.useAttack(_arena.home, _arena.away, [{ target: undefined, ..._ability.attack }], targets);
        }
        if (_ability.spell) {
            await this.useSpell(_arena.home, _arena.away, [{ target: undefined, ..._ability.spell }], targets);
        }
        await Script.EventBus.dispatchEvent({ type: Script.EVENT.TRIGGERED_ABILITY, cause: this, target: this, trigger: _ability });
    }
    Script.executeAbility = executeAbility;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Stone {
        #level;
        #abilityLevels;
        #id;
        #triggers;
        constructor(_data, _level = 0) {
            this.#triggers = new Set();
            this.abilityEventListener = async (_ev) => {
                await this.runAbility(_ev);
            };
            this.level = _level;
            this.#abilityLevels = _data.abilityLevels;
            this.#id = _data.id;
            for (let ability of this.#abilityLevels) {
                if (Array.isArray(ability.on)) {
                    for (let ev of ability.on) {
                        this.#triggers.add(ev);
                    }
                }
                else {
                    this.#triggers.add(ability.on);
                }
            }
        }
        set level(_lvl) {
            this.#level = Math.max(0, Math.min(this.#abilityLevels.length - 1, _lvl));
        }
        get id() {
            return this.#id;
        }
        registerEventListeners() {
            for (let trigger of this.#triggers) {
                Script.EventBus.addEventListener(trigger, this.abilityEventListener);
            }
        }
        removeEventListeners() {
            for (let trigger of this.#triggers) {
                Script.EventBus.removeEventListener(trigger, this.abilityEventListener);
            }
        }
        async runAbility(_ev) {
            let ability = this.#abilityLevels[this.#level];
            if (!ability)
                return;
            Script.executeAbility.call(this, ability, Script.Fight.activeFight.arena, _ev);
        }
    }
    Script.Stone = Stone;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Grid {
        static { this.GRIDSIZE = 3; }
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
            for (let x = 0; x < Grid.GRIDSIZE; x++) {
                for (let y = 0; y < Grid.GRIDSIZE; y++) {
                    this.grid[x][y] = _content[y][x];
                }
            }
        }
        ;
        static EMPTY() {
            return [[, , ,], [, , ,], [, , ,]];
        }
        get(_pos) {
            if (Grid.outOfBounds(_pos))
                return undefined;
            return this.grid[_pos[0]][_pos[1]];
        }
        set(_pos, _el) {
            if (Grid.outOfBounds(_pos))
                return undefined;
            return this.grid[_pos[0]][_pos[1]] = _el;
        }
        /** Runs through each **POSITION** of the grid, regardless of whether it is set */
        forEachPosition(callback) {
            for (let y = 0; y < Grid.GRIDSIZE; y++)
                for (let x = 0; x < Grid.GRIDSIZE; x++) {
                    callback(this.grid[x][y], [x, y]);
                }
        }
        /** Runs through each **POSITION** of the grid, regardless of whether it is set, **await**ing each callback */
        async forEachPositionAsync(callback) {
            for (let y = 0; y < Grid.GRIDSIZE; y++)
                for (let x = 0; x < Grid.GRIDSIZE; x++) {
                    await callback(this.grid[x][y], [x, y]);
                }
        }
        /** Runs through each **ELEMENT** present in the grid, skips empty spots */
        forEachElement(callback) {
            for (let y = 0; y < Grid.GRIDSIZE; y++)
                for (let x = 0; x < Grid.GRIDSIZE; x++) {
                    if (this.grid[x][y])
                        callback(this.grid[x][y], [x, y]);
                }
        }
        /** Runs through each **ELEMENT** present in the grid, skips empty spots, **await**ing each callback */
        async forEachElementAsync(callback) {
            for (let y = 0; y < Grid.GRIDSIZE; y++)
                for (let x = 0; x < Grid.GRIDSIZE; x++) {
                    if (this.grid[x][y])
                        await callback(this.grid[x][y], [x, y]);
                }
        }
        get occupiedSpots() {
            let total = 0;
            this.forEachElement(() => {
                total++;
            });
            return total;
        }
        static outOfBounds(_pos) {
            return _pos[0] < 0 || _pos[0] >= Grid.GRIDSIZE || _pos[1] < 0 || _pos[1] >= Grid.GRIDSIZE;
        }
    }
    Script.Grid = Grid;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function initEntitiesInGrid(_grid, _entity) {
        const grid = new Script.Grid(_grid);
        const newGrid = new Script.Grid();
        const data = Script.Provider.data;
        //const visualizer = Provider.visualizer;
        grid.forEachElement((entityId, pos) => {
            let entityData = data.getEntity(entityId);
            if (!entityData)
                throw new Error(`Entity ${entityId} not found.`);
            newGrid.set(pos, new _entity(entityData, pos));
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
    async function getCloneNodeFromRegistry(id) {
        let node = Script.DataLink.linkedNodes.get(id);
        if (!node)
            return undefined;
        const newNode = new ƒ.Node("");
        await newNode.deserialize(node.serialize());
        return newNode;
    }
    Script.getCloneNodeFromRegistry = getCloneNodeFromRegistry;
})(Script || (Script = {}));
var Script;
(function (Script) {
    /** Handles an entire run */
    class Run {
        constructor() {
            this.eumlings = [];
            this.stones = [];
            this.progress = 0;
            this.encountersUntilBoss = 10;
        }
        async start() {
            // TODO: Select Start-Eumling Properly
            let eumling;
            while (eumling !== "R" && eumling !== "S") {
                eumling = prompt("Which eumling you want to start with? (R or S)", "R").trim().toUpperCase();
            }
            this.eumlings.push(new Script.Eumling(eumling));
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.RUN_START });
            await this.nextStep();
        }
        async nextStep() {
            this.progress++;
            let nextEncounter = await this.chooseNext();
            const result = await this.runFight(nextEncounter);
            if (result === Script.FIGHT_RESULT.DEFEAT) {
                return this.end();
            }
            if (this.progress > this.encountersUntilBoss) {
                return this.end();
            }
            await this.nextStep();
        }
        async chooseNext() {
            // TODO: replace this with a proper selection system, for now you can directly choose only fights
            let chosenFight = -1;
            if (this.progress === this.encountersUntilBoss) {
                chosenFight = 0;
            }
            const fights = Script.Provider.data.fights;
            while (isNaN(chosenFight) || chosenFight < 0 || chosenFight >= fights.length) {
                chosenFight = parseInt(prompt(`Next fight id (0 - ${fights.length - 1})`));
            }
            return fights[chosenFight];
        }
        async runFight(_fight) {
            // TODO: proper prepare fight positioning etc. This here is just a temp solution
            let eumlingsGrid = new Script.Grid();
            for (let eumling of this.eumlings) {
                let pos = [-1, -1];
                while (Script.Grid.outOfBounds(pos)) {
                    let input = prompt(`Where do you want to put your ${eumling.id}? Format: x,y, but x-mirrored!`, "1,1");
                    let split = input.split(",");
                    if (split.length !== 2)
                        continue;
                    let newPos = [parseInt(split[0]), parseInt(split[1])];
                    if (isNaN(newPos[0]) || isNaN(newPos[1]))
                        continue;
                    pos = newPos;
                }
                eumlingsGrid.set(pos, eumling);
            }
            // actually run the fight
            const fight = new Script.Fight(_fight, eumlingsGrid);
            const result = await fight.run();
            return result;
        }
        async end() {
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.RUN_END });
        }
        addEventListeners() {
        }
        removeEventListeners() {
        }
    }
    Script.Run = Run;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class VisualizeFightNull {
        #home;
        #away;
        constructor(_fight) {
            let awayGrid = new Script.Grid();
            _fight.arena.away.forEachElement((entity, pos) => {
                awayGrid.set(pos, new Script.VisualizeEntity(entity));
            });
            this.#away = new Script.IVisualizeGrid(awayGrid, "away");
            let homeGrid = new Script.Grid();
            _fight.arena.home.forEachElement((entity, pos) => {
                homeGrid.set(pos, new Script.VisualizeEntity(entity));
            });
            this.#home = new Script.IVisualizeGrid(homeGrid, "home");
            Script.Provider.visualizer.addToScene(this.#away);
            Script.Provider.visualizer.addToScene(this.#home);
            Script.Provider.visualizer.drawScene();
        }
        async showGrid() {
            let visualizer = Script.Provider.visualizer;
            // let grid: string[][] = [[, , , , , , ,], [], []];
            // this.#home.grid.forEachElement((el, pos) => {
            //     if (!el) return;
            //     let entity = (<VisualizeEntity>el).getEntity();
            //     grid[pos[1]][2 - pos[0]] = `${entity.id}\n${entity.currentHealth} ♥️`;
            //     el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            // })
            // this.#away.grid.forEachElement((el, pos) => {
            //     if (!el) return;
            //     let entity = (<VisualizeEntity>el).getEntity();
            //     grid[pos[1]][pos[0] + 4] = `${entity.id}\n${entity.currentHealth} ♥️`;
            //     el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            // })
            // console.table(grid);
            //draw the 3D scene
            visualizer.drawScene();
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
            // TODO @Björn clean up visible entities
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
        constructor(_entity) {
            super("entity");
            this.eventListener = async (_ev) => {
                await this.handleEvent(_ev);
            };
            this.entity = _entity;
            //get the correct
            console.log("ID: " + this.entity.id);
            this.loadModel(this.entity.id);
            // const entityMesh = new ƒ.ComponentMesh(VisualizeEntity.mesh);
            // const entityMat = new ƒ.ComponentMaterial(VisualizeEntity.material);
            // this.addComponent(entityMesh);
            // this.addComponent(entityMat);
            // entityMesh.mtxPivot.scale(ƒ.Vector3.ONE(this.size));
            // entityMat.clrPrimary.setCSS("white");
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.scaling = ƒ.Vector3.ONE(1.0);
            Script.Provider.visualizer.addToScene(this);
            this.addEventListeners();
        }
        async idle() {
            // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
            await Script.waitMS(200);
        }
        //#region Do something
        async attack(_ev) {
            console.log("entity visualizer null: attack", { attacker: this.entity, attack: _ev.trigger, targets: _ev.detail.targets });
            let node = await Script.getCloneNodeFromRegistry("attack");
            if (node)
                this.addChild(node);
            await Script.waitMS(1000);
            if (node)
                this.removeChild(node);
        }
        async move(_move) {
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3());
            console.log("entity visualizer null: move", _move);
            await Script.waitMS(200);
        }
        async useSpell(_ev) {
            console.log("entity visualizer null: spell", { caster: this.entity, spell: _ev.trigger, targets: _ev.detail?.targets });
            let node = await Script.getCloneNodeFromRegistry("spell");
            if (node)
                this.addChild(node);
            await Script.waitMS(1000);
            if (node)
                this.removeChild(node);
        }
        //#endregion
        //#region Something happened
        async getHurt(_ev) {
            let node = await Script.getCloneNodeFromRegistry("hurt");
            if (node)
                this.addChild(node);
            await Script.waitMS(1000);
            if (node)
                this.removeChild(node);
        }
        async getAffected(_ev) {
            let node = await Script.getCloneNodeFromRegistry("affected");
            if (node)
                this.addChild(node);
            await Script.waitMS(1000);
            if (node)
                this.removeChild(node);
        }
        async die(_ev) {
            // TODO: this is a temp, should probably better be done in the visualizer above this, not this one.
            this.removeAllChildren();
            // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("hotpink");
            await Script.waitMS(1000);
            // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
        }
        async resist() {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("gray");
            console.log("entity visualizer null: resisting", this.entity);
            await Script.waitMS(200);
        }
        //#endregion
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
        async loadModel(_id) {
            let model = new ƒ.Node(_id);
            let original = Script.DataLink.linkedNodes.get(_id);
            try {
                await model.deserialize(original.serialize());
            }
            catch (error) {
                model = this.givePlaceholderPls();
                console.warn(`Model with ID: ${_id} not found, using placeholder instead 👉👈`);
            }
            this.addChild(model);
        }
        givePlaceholderPls() {
            let placeholder = new ƒ.Node("Placeholder");
            let mesh = new ƒ.MeshCube("EntityMesh");
            let material = new ƒ.Material("EntityMat", ƒ.ShaderLitTextured);
            placeholder.addComponent(new ƒ.ComponentMesh(mesh));
            placeholder.addComponent(new ƒ.ComponentMaterial(material));
            placeholder.addComponent(new ƒ.ComponentTransform());
            console.log("placeholder");
            console.log(placeholder);
            return placeholder;
        }
        getEntity() {
            return this.entity;
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_ENDED, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_ATTACK, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_HURT, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_AFFECTED, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_DIES, this.eventListener);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.FIGHT_ENDED, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_ATTACK, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_HURT, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_AFFECTED, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_DIES, this.eventListener);
        }
        async handleEvent(_ev) {
            if (_ev.cause === this.entity) {
                // this entity is doing something
                switch (_ev.type) {
                    case Script.EVENT.ENTITY_ATTACK: {
                        await this.attack(_ev);
                        break;
                    }
                    case Script.EVENT.ENTITY_SPELL_BEFORE: {
                        await this.useSpell(_ev);
                        break;
                    }
                }
            }
            else if (_ev.target === this.entity) {
                // this entity is affected by something
                switch (_ev.type) {
                    case Script.EVENT.ENTITY_HURT: {
                        await this.getHurt(_ev);
                        break;
                    }
                    case Script.EVENT.ENTITY_AFFECTED: {
                        await this.getAffected(_ev);
                        break;
                    }
                    case Script.EVENT.ENTITY_DIES: {
                        await this.die(_ev);
                        break;
                    }
                }
            }
            else {
                // independent events
                switch (_ev.type) {
                    case Script.EVENT.FIGHT_ENDED: {
                        this.removeEventListeners();
                        break;
                    }
                }
            }
        }
    }
    Script.VisualizeEntity = VisualizeEntity;
})(Script || (Script = {}));
// namespace Script {
//     export interface IVisualizeEntity {
//         attack(_attack: AttackData, _targets: IEntity[]): Promise<void>;
//         move(_move: MoveData): Promise<void>;
//         hurt(_damage: number, _crit: boolean): Promise<void>;
//         resist(): Promise<void>;
//         spell(_spell: SpellData, _targets: IEntity[]): Promise<void>;
//         showPreview(): Promise<void>;
//         hidePreview(): Promise<void>;
//         /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
//         updateVisuals(): void;
//     }
//     export class VisualizeEntityNull implements IVisualizeEntity {
//         #entity: IEntity;
//         constructor(_entity: IEntity) { this.#entity = _entity; }
//         async attack(_attack: AttackData, _targets: IEntity[]): Promise<void> {
//             console.log("entity visualizer null: attack", {attacker: this.#entity, attack: _attack, targets: _targets});
//             await waitMS(200);
//         }
//         async move(_move: MoveData): Promise<void> {
//             console.log("entity visualizer null: move", _move);
//             await waitMS(200);
//         }
//         async hurt(_damage: number, _crit: boolean): Promise<void> {
//             console.log("entity visualizer null: hurt", {hurtEntity: this.#entity, damage: _damage, wasCrit: _crit});
//             await waitMS(200);
//         }
//         async spell(_spell: SpellData, _targets: IEntity[]): Promise<void> {
//             console.log("entity visualizer null: spell", {caster: this.#entity, spell: _spell, targets: _targets});
//             await waitMS(200);
//         }
//         async showPreview(): Promise<void> {
//             console.log("entity visualizer null: show preview", this.#entity);
//             await waitMS(200);
//         }
//         async hidePreview(): Promise<void> {
//             console.log("entity visualizer null: hide preview", this.#entity);
//             await waitMS(200);
//         }
//         async updateVisuals(): Promise<void> {
//             // console.log("entity visualizer null: updateVisuals", this.#entity);
//             // await waitMS(200);
//         }
//         async resist(): Promise<void> {
//             console.log("entity visualizer null: resisting", this.#entity);
//             await waitMS(200);    
//         }
//         getEntity(): Readonly<IEntity> {
//             return this.#entity;
//         }
//     }
// }
// namespace Script {
//     import ƒ = FudgeCore;
//     export interface IVisualizeGrid {
//         getRealPosition(_pos: Position): any;
//         updateVisuals(): void;
//     }
//     export class VisualizeGridNull extends ƒ.Node implements IVisualizeGrid {
//         grid: Grid<VisualizeEntity>;
//         constructor(_grid: Grid<VisualizeEntity>) {
//             super("VisualizeGridNull");
//             this.grid = _grid;
//             this.addComponent(new ƒ.ComponentTransform());
//             this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3(0, 0, 0));
//         }
//         updateVisuals(): void {
//             this.grid.forEachElement((element) => {
//                 element?.updateVisuals();
//             });
//         }
//         getRealPosition(_pos: Position) {
//             return _pos;
//         }
//     }
// }
var Script;
(function (Script) {
    //Visualize the Entities in the Grid
    //Instances the Entities in the correct grid Position
    var ƒ = FudgeCore;
    class IVisualizeGrid extends ƒ.Node {
        constructor(_grid, _side) {
            super("VisualizeGrid");
            this.grid = _grid;
            if (_side === "home" || "away") {
                this.side = _side;
            }
            else {
                throw new Error("Use home or away for the side parameter");
            }
            this.addComponent(new ƒ.ComponentTransform());
            //set the positions of the entities in the grid
            this.grid.forEachElement((element, pos) => {
                let visSide;
                //get Placeholders from scene
                if (this.side === "away") {
                    visSide = Script.Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
                }
                else if (this.side === "home") {
                    visSide = Script.Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
                }
                //let away: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("away")[0];
                /**Anchors are named from 0-8 */
                let anchor = this.getAnchor(visSide, pos[0], pos[1]);
                //get the Positions from the placeholders and translate the entities to it
                let position = anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;
                console.log("position: " + position);
                element.mtxLocal.translation = new ƒ.Vector3(position.x, position.y, position.z);
                console.log("element position: " + element.mtxLocal.translation);
                this.addChild(element);
            });
        }
        getAnchor(_side, _x, _z) {
            let anchor;
            let pointer = _z * 3 + _x;
            console.log("pointer: " + pointer);
            anchor = _side.getChildByName(pointer.toString());
            return anchor;
        }
    }
    Script.IVisualizeGrid = IVisualizeGrid;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map