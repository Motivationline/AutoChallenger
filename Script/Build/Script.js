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
        EVENT["RUN_PREPARE"] = "runPrepare";
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
        EVENT["ENTITY_CREATE"] = "entityCreate";
        EVENT["ENTITY_CREATED"] = "entityCreated";
        EVENT["ENTITY_ADDED"] = "entityAdded";
        EVENT["ENTITY_REMOVED"] = "entityRemoved";
        EVENT["ENTITY_MOVE"] = "entityMove";
        EVENT["ENTITY_MOVED"] = "entityMoved";
        EVENT["TRIGGER_ABILITY"] = "triggerAbility";
        EVENT["TRIGGERED_ABILITY"] = "triggeredAbility";
        EVENT["GOLD_CHANGE"] = "goldChange";
        EVENT["CHOOSE_EUMLING"] = "chooseEumling";
        EVENT["CHOSEN_EUMLING"] = "chosenEumling";
        EVENT["CHOOSE_STONE"] = "chooseStone";
        EVENT["CHOSEN_STONE"] = "chosenStone";
        EVENT["CHOOSE_ENCOUNTER"] = "chooseEncounter";
        EVENT["CHOSEN_ENCOUNTER"] = "chosenEncounter";
        EVENT["SHOP_OPEN"] = "shopOpen";
        EVENT["SHOP_CLOSE"] = "shopClose";
        EVENT["REWARDS_OPEN"] = "rewardsOpen";
        EVENT["REWARDS_CLOSE"] = "rewardsClose";
        EVENT["EUMLING_XP_GAIN"] = "eumlingXPGain";
        EVENT["EUMLING_LEVELUP_CHOOSE"] = "eumlingLevelupChoose";
        EVENT["EUMLING_LEVELUP_CHOSEN"] = "eumlingLevelupChosen";
        EVENT["EUMLING_LEVELUP"] = "eumlingLevelup";
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
            // TODO think about whether it makes sense to allow only one event active at a time, e.g. through a queue
            if (!this.listeners.has(_ev.type))
                return;
            const listeners = [...this.listeners.get(_ev.type)]; // copying this so removing listeners doesn't skip any
            for (let listener of listeners) {
                try {
                    await listener(_ev);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        static async awaitSpecificEvent(_type) {
            return new Promise((resolve) => {
                const resolver = (_ev) => {
                    this.removeEventListener(_type, resolver);
                    resolve(_ev);
                };
                this.addEventListener(_type, resolver);
            });
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
    // function move(_fight: Fight) {
    //     //create a new Grid, calls entity[].move(), add them to the grid
    //     let newGrid = new Grid<Entity>();
    //     //move the entities in the grid
    //     _fight.arena.away.forEachElement((entity, pos) => {
    //         entity.move()
    //         newGrid.set(pos, new Entity(entity));
    //     });
    //     //replace old Grid
    //     _fight.arena.away = newGrid;
    // }
    // @Björn die Verrenkung brauchst du nicht machen, du kannst move() einfach direkt in der Fight runOneSide aufrufen
    // außerdem ist das EntityMove Event dazu gedacht dass eine Entity das auslöst, wenn sie sich bewegt
    // ✓
    // @Björn hier sollten noch ein paar asyncs und awaits rein
    async function move(_grid) {
        //let grid: Grid<Entity> = _grid;
        let maxAlternatives = 0;
        let movedEntites = 0;
        _grid.forEachElement((el) => {
            el.moved = false;
        });
        //loop untill all alternatives have been tried and every entity moved
        while (maxAlternatives <= 8 && movedEntites < _grid.occupiedSpots) {
            let movedThisTurn = false;
            await _grid.forEachElementAsync(async (el) => {
                //check if the Entity hasn't moved yet
                if (el.moved == false) {
                    //try to move
                    let res = await el.tryToMove(_grid, maxAlternatives);
                    if (res) {
                        movedThisTurn = true;
                        movedEntites++;
                    }
                }
            });
            if (movedThisTurn == false) {
                maxAlternatives++;
            }
        }
        //all entities moved
    }
    Script.move = move;
    function getNextDirection(_rotateBy, _direction) {
        let directions = [
            [1, 0], // East
            [1, 1], // North-East
            [0, 1], // North
            [-1, 1], // North-West
            [-1, 0], // West
            [-1, -1], // South-West
            [0, -1], // South
            [1, -1] // South-East
        ];
        let i = directions.findIndex(dir => dir[0] === _direction[0] && dir[1] === _direction[1]);
        //get the index for the next rotation
        let selector = (i + _rotateBy) % 8;
        //get the direction from the array
        let dir = directions[selector];
        return dir;
    }
    Script.getNextDirection = getNextDirection;
    // calculate the next position based on the current position, the entities rotation and the step size
    function getPositionBasedOnMove(_pos, _direction, _step, _rotateBy) {
        //console.log("direction: " + _direction + ", step: " + _step + ", position: " + _pos + ", rotateBy: " + _rotateBy);
        let dir = getNextDirection(_rotateBy, _direction);
        let pos = [_step * dir[0] + _pos[0], _step * dir[1] + _pos[1]];
        //console.log(" New direction: " + dir + ", New position: " + pos);
        return pos;
    }
    Script.getPositionBasedOnMove = getPositionBasedOnMove;
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
                moves: { direction: Script.DIRECTION_RELATIVE.FORWARD, rotateBy: 4, currentDirection: [1, 0], distance: 1, blocked: { attempts: 8, rotateBy: 4 } }
            },
            {
                id: "moveMultiple",
                health: 5,
                moves: {
                    options: [
                        { direction: Script.DIRECTION_RELATIVE.FORWARD, currentDirection: [1, 0], distance: 1 },
                        { rotateBy: 2, direction: Script.DIRECTION_RELATIVE.FORWARD, currentDirection: [1, 0], distance: 1 },
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
                id: "RA-Eumling",
                health: 4,
                attacks: {
                    options: [
                        {
                            baseDamage: 1,
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.ROW,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.COLUMN,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.DIAGONALS,
                                },
                            },
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
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
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW, // TODO: NEEDS TO ATTACK NEXT ROW IF NO ENEMY
                            shape: Script.AREA_SHAPE.SINGLE,
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
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_SAME,
                                    shape: Script.AREA_SHAPE.ROW,
                                },
                            },
                            type: Script.SPELL_TYPE.STRENGTH,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_SAME,
                                    shape: Script.AREA_SHAPE.COLUMN,
                                },
                            },
                            type: Script.SPELL_TYPE.STRENGTH,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_SAME,
                                    shape: Script.AREA_SHAPE.DIAGONALS,
                                },
                            },
                            type: Script.SPELL_TYPE.STRENGTH,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
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
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.ROW,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.COLUMN,
                                },
                            },
                        },
                        {
                            baseDamage: 1,
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                                    shape: Script.AREA_SHAPE.DIAGONALS,
                                },
                            },
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
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
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_MIRRORED, // TODO: NEEDS TO ATTACK NEXT ROW IF NO ENEMY
                            shape: Script.AREA_SHAPE.ROW,
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
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW, // TODO: NEEDS TO ATTACK NEXT ROW IF NO ENEMY
                            shape: Script.AREA_SHAPE.SINGLE,
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
                    target: Script.TARGET.SELF,
                    type: Script.SPELL_TYPE.HEAL,
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
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 3,
                    }
                },
                abilities: [{
                        on: Script.EVENT.ENTITY_HEALED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                            }],
                        target: "target",
                        spell: {
                            type: Script.SPELL_TYPE.SHIELD,
                            level: 1,
                        }
                    }]
            },
            {
                id: "SI-Eumling",
                health: 5,
                spells: {
                    target: Script.TARGET.RANDOM_ALLY,
                    type: Script.SPELL_TYPE.HEAL,
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
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 3,
                    }
                },
                abilities: [{
                        on: Script.EVENT.ENTITY_HEALED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                            }],
                        target: "target",
                        spell: {
                            type: Script.SPELL_TYPE.SHIELD,
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
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 3,
                    }
                },
                abilities: [{
                        on: Script.EVENT.ENTITY_HEALED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                            }],
                        target: "target",
                        spell: {
                            type: Script.SPELL_TYPE.SHIELD,
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
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.ALLY,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            type: Script.SPELL_TYPE.HEAL,
                            level: 1,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 6,
                    }
                }
            },
            {
                id: "SIE-Eumling", // TODO: +1 Gold per heart that is healed
                health: 6,
                spells: {
                    target: Script.TARGET.RANDOM_ALLY,
                    type: Script.SPELL_TYPE.HEAL,
                    level: 2,
                },
            },
            {
                id: "cactusCrawler", // doesn't attack but gets thorns after moving
                health: 1,
                moves: { direction: Script.DIRECTION_RELATIVE.FORWARD, rotateBy: 4, currentDirection: [1, 0], distance: 1, blocked: { attempts: 8, rotateBy: 4 } },
                //startDirection: 6, // down
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
            },
            {
                id: "pushover",
                health: 1,
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
                rounds: 3,
                entities: [["pushover", "pushover", "pushover",], [, , ,], [, , ,]]
            },
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
                    ["cactusCrawler", , "sandSitter",],
                    [, , ,],
                    [, "cactusCrawler", "sandSitter",]
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
        #enemyStartCount;
        constructor(_fight, _home) {
            this.handleDeadEntity = async (_ev) => {
                let deadEntity = _ev.target;
                this.arena.home.forEachElement((el, pos) => {
                    if (el !== deadEntity)
                        return;
                    this.arena.home.remove(pos);
                });
                this.arena.away.forEachElement((el, pos) => {
                    if (el !== deadEntity)
                        return;
                    this.arena.away.remove(pos);
                });
            };
            this.handleEntityChange = (_ev) => {
                if (_ev.type === Script.EVENT.ENTITY_ADDED) {
                    const entity = _ev.target;
                    const side = _ev.detail.side;
                    const pos = _ev.detail.pos;
                    if (!entity || !side || !pos)
                        return;
                    let sideGrid = side === "home" ? this.arena.home : this.arena.away;
                    sideGrid.set(pos, entity, true);
                    entity.position = pos;
                }
                else if (_ev.type === Script.EVENT.ENTITY_REMOVED) {
                    const entity = _ev.target;
                    if (!entity)
                        return;
                    let pos = this.arena.home.findElementPosition(entity);
                    if (pos)
                        this.arena.home.remove(pos);
                    pos = this.arena.away.findElementPosition(entity);
                    if (pos)
                        this.arena.away.remove(pos);
                }
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
            this.#enemyStartCount = this.arena.away.occupiedSpots;
            this.addEventListeners();
            Fight.activeFight = this;
        }
        get enemyCountAtStart() {
            return this.#enemyStartCount;
        }
        getRounds() {
            return this.rounds;
        }
        async run() {
            // Eventlisteners
            // EventBus.removeAllEventListeners();
            //TODO: Add stones
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_START });
            // run actual round
            for (let r = 0; r < this.rounds; r++) {
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ROUND_START, detail: { round: r } });
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ROUND_END, detail: { round: r } });
                //output arena for debugging
                console.log("Away Arena: ");
                console.log(this.arena.away);
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
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_END, detail: { result: _result } });
            Fight.activeFight = undefined;
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_ENDED, detail: { result: _result } });
            this.removeEventListeners();
            return _result;
        }
        async runOneSide(_active, _passive) {
            // TODO: moves
            // @Björn hier die move mit dem aktiven grid aufrufen (und abwarten)
            // ✓
            await Script.move(_active);
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
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_ADDED, this.handleEntityChange);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_REMOVED, this.handleEntityChange);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_DIED, this.handleDeadEntity);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_ADDED, this.handleEntityChange);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_REMOVED, this.handleEntityChange);
        }
    }
    Script.Fight = Fight;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Visualizer {
        #gui;
        constructor() {
            this.entities = new Map();
            this.fights = new Map();
            this.createEntityHandler = (_ev) => {
                const entity = _ev.target;
                if (!entity)
                    return;
                this.createEntity(entity);
            };
            this.fightPrepHandler = (_ev) => {
                const fight = _ev.detail.fight;
                if (!fight)
                    return;
                this.getFight(fight);
            };
            this.root = new ƒ.Node("Root");
            this.addEventListeners();
        }
        getEntity(_entity) {
            if (!this.entities.has(_entity)) {
                this.createEntity(_entity);
            }
            return this.entities.get(_entity);
        }
        getFight(_fight) {
            if (!this.fights.has(_fight)) {
                this.fights.set(_fight, new Script.VisualizeFight(_fight));
            }
            return this.fights.get(_fight);
        }
        getGUI() {
            if (!this.#gui)
                this.#gui = new Script.VisualizeGUI();
            return this.#gui;
        }
        initializeScene(_viewport) {
            this.viewport = _viewport;
            this.getGUI();
            console.log(this.root);
            let fightScene = ƒ.Project.getResourcesByName("FightScene")[0];
            //attach the root node to the FightScene
            this.camera = fightScene.getChildByName("CameraRotator").getChildByName("Camera_Wrapper").getChildByName("Cam").getComponent(ƒ.ComponentCamera);
            fightScene.addChild(this.root);
            _viewport.initialize("Viewport", fightScene, this.camera, document.querySelector("canvas"));
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
        createEntity(_entity) {
            const entityVis = new Script.VisualizeEntity(_entity);
            this.entities.set(_entity, entityVis);
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_CREATE, this.createEntityHandler);
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_PREPARE, this.fightPrepHandler);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_CREATE, this.createEntityHandler);
        }
    }
    Script.Visualizer = Visualizer;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class UILayer {
        onAdd(_zindex, _ev) {
            this.element.classList.remove("hidden");
            this.element.style.zIndex = _zindex.toString();
            this.addEventListeners();
        }
        onShow() {
            this.element.classList.remove("hidden");
        }
        onHide() {
            this.element.classList.add("hidden"); // TODO should it really get hidden? or just disabled?
        }
        onRemove() {
            this.element.classList.add("hidden");
            this.removeEventListeners();
        }
    }
    Script.UILayer = UILayer;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class FightUI extends Script.UILayer {
        constructor() {
            super();
            this.updateRoundCounter = async (_ev) => {
                let round = _ev.detail.round;
                const roundCounters = document.querySelectorAll(".RoundCounter");
                await Script.waitMS(500);
                for (let roundCounter of roundCounters) {
                    roundCounter.innerText = `Round: ${round + 1}`;
                }
                const overlay = document.getElementById("FightPhaseOverlay");
                overlay.classList.add("active");
                await Script.waitMS(1000);
                overlay.classList.remove("active");
                await Script.waitMS(500);
            };
            this.element = document.getElementById("Fight");
            this.stoneWrapper = document.getElementById("FightStones");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.initStones();
        }
        initStones() {
            const stones = [];
            for (let stone of Script.Run.currentRun.stones) {
                stones.push(Script.StoneUIElement.getUIElement(stone).element);
            }
            this.stoneWrapper.replaceChildren(...stones);
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ROUND_START, this.updateRoundCounter);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ROUND_START, this.updateRoundCounter);
        }
    }
    Script.FightUI = FightUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class ChooseEumlingUI extends Script.UILayer {
        constructor() {
            super();
            this.optionElements = new Map();
            this.clickedEumling = (_ev) => {
                let element = _ev.currentTarget;
                let eumling = this.optionElements.get(element);
                for (let elem of this.optionElements.keys()) {
                    elem.classList.remove("selected");
                }
                element.classList.add("selected");
                this.selectedEumling = eumling;
                this.confirmButton.disabled = false;
            };
            this.confirm = () => {
                if (!this.selectedEumling)
                    return;
                for (let elem of this.optionElements.keys()) {
                    elem.classList.remove("selected");
                }
                Script.Provider.GUI.removeTopmostUI();
                Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOSEN_EUMLING, detail: { eumling: this.selectedEumling } });
            };
            this.element = document.getElementById("ChooseEumling");
            this.confirmButton = document.getElementById("ChooseEumlingConfirm");
        }
        onAdd(_zindex) {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;
            const optionElement = document.getElementById("ChooseEumlingOptions");
            const options = ["R", "S"];
            this.optionElements.clear();
            for (let opt of options) {
                let eumling = new Script.Eumling(opt);
                let uiElement = Script.EumlingUIElement.getUIElement(eumling);
                uiElement.element.addEventListener("click", this.clickedEumling);
                this.optionElements.set(uiElement.element, eumling);
                optionElement.appendChild(uiElement.element);
            }
            optionElement.replaceChildren(...this.optionElements.keys());
        }
        addEventListeners() {
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners() {
            for (let el of this.optionElements.keys()) {
                el.removeEventListener("click", this.clickedEumling);
            }
            this.confirmButton.removeEventListener("click", this.confirm);
        }
    }
    Script.ChooseEumlingUI = ChooseEumlingUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class ChooseStoneUI extends Script.UILayer {
        constructor() {
            super();
            this.optionElements = new Map();
            this.clickedStone = (_ev) => {
                let element = _ev.currentTarget;
                let stone = this.optionElements.get(element);
                for (let elem of this.optionElements.keys()) {
                    elem.classList.remove("selected");
                }
                element.classList.add("selected");
                this.selectedStone = stone;
                this.confirmButton.disabled = false;
            };
            this.confirm = () => {
                if (!this.selectedStone)
                    return;
                for (let elem of this.optionElements.keys()) {
                    elem.classList.remove("selected");
                }
                Script.Provider.GUI.removeTopmostUI();
                Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOSEN_STONE, detail: { stone: this.selectedStone } });
            };
            this.element = document.getElementById("ChooseStone");
            this.confirmButton = document.getElementById("ChooseStoneConfirm");
        }
        onAdd(_zindex) {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;
            const optionElement = document.getElementById("ChooseStoneOptions");
            this.optionElements.clear();
            const options = Script.chooseRandomElementsFromArray(Script.Provider.data.stones, 3);
            for (let opt of options) {
                let stone = new Script.Stone(opt);
                let uiElement = Script.StoneUIElement.getUIElement(stone);
                uiElement.element.addEventListener("click", this.clickedStone);
                this.optionElements.set(uiElement.element, stone);
                optionElement.appendChild(uiElement.element);
            }
            optionElement.replaceChildren(...this.optionElements.keys());
        }
        addEventListeners() {
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners() {
            for (let el of this.optionElements.keys()) {
                el.removeEventListener("click", this.clickedStone);
            }
            this.confirmButton.removeEventListener("click", this.confirm);
        }
    }
    Script.ChooseStoneUI = ChooseStoneUI;
})(Script || (Script = {}));
/// <reference path="FightUI.ts" />
/// <reference path="ChooseEumlingUI.ts" />
/// <reference path="ChooseStoneUI.ts" />
var Script;
/// <reference path="FightUI.ts" />
/// <reference path="ChooseEumlingUI.ts" />
/// <reference path="ChooseStoneUI.ts" />
(function (Script) {
    // TODO: add Provider to pass UI elements without hardcoding???
    class VisualizeGUI {
        constructor() {
            this.uis = new Map();
            this.activeLayers = [];
            this.switchUI = (_ev) => {
                switch (_ev.type) {
                    case Script.EVENT.FIGHT_START: {
                        this.replaceUI("fight", _ev);
                        break;
                    }
                    case Script.EVENT.CHOOSE_STONE: {
                        this.replaceUI("chooseStone", _ev);
                        break;
                    }
                    case Script.EVENT.CHOOSE_EUMLING: {
                        this.replaceUI("chooseEumling", _ev);
                        break;
                    }
                    case Script.EVENT.CHOOSE_ENCOUNTER: {
                        this.replaceUI("chooseEncounter", _ev);
                        break;
                    }
                    case Script.EVENT.FIGHT_PREPARE: {
                        this.replaceUI("fightPrepare", _ev);
                        break;
                    }
                    case Script.EVENT.REWARDS_OPEN: {
                        this.replaceUI("fightReward", _ev);
                        break;
                    }
                    case Script.EVENT.EUMLING_LEVELUP_CHOOSE: {
                        this.addUI("eumlingLevelup", _ev);
                        break;
                    }
                    case Script.EVENT.SHOP_OPEN: {
                        this.replaceUI("shop", _ev);
                        break;
                    }
                    case Script.EVENT.RUN_END: {
                        this.replaceUI("runEnd", _ev);
                        break;
                    }
                }
            };
            this.uis.clear();
            this.uis.set("chooseEumling", new Script.ChooseEumlingUI());
            this.uis.set("chooseStone", new Script.ChooseStoneUI());
            this.uis.set("chooseEncounter", new Script.MapUI());
            this.uis.set("map", new Script.MapUI());
            this.uis.set("fightPrepare", new Script.FightPrepUI());
            this.uis.set("fight", new Script.FightUI());
            this.uis.set("fightReward", new Script.FightRewardUI());
            this.uis.set("eumlingLevelup", new Script.EumlingLevelupUI());
            this.uis.set("shop", new Script.ShopUI());
            this.uis.set("runEnd", new Script.RunEndUI());
            this.addFightListeners();
            for (let ui of this.uis.values()) {
                ui.onRemove();
            }
        }
        get topmostLevel() {
            if (this.activeLayers.length === 0)
                return undefined;
            return this.activeLayers[this.activeLayers.length - 1];
        }
        addUI(_id, _ev) {
            let ui = this.uis.get(_id);
            if (!ui)
                return;
            let prevTop = this.topmostLevel;
            if (prevTop)
                prevTop.onHide();
            this.activeLayers.push(ui);
            ui.onAdd(1000 + this.activeLayers.length, _ev);
        }
        replaceUI(_id, _ev) {
            this.removeTopmostUI();
            this.addUI(_id, _ev);
        }
        removeTopmostUI() {
            let last = this.activeLayers.pop();
            last?.onHide();
            last?.onRemove();
            let newTop = this.topmostLevel;
            if (newTop)
                newTop.onShow();
        }
        removeAllLayers() {
            while (this.activeLayers.length > 0) {
                this.removeTopmostUI();
            }
        }
        updateGoldCounter(_ev) {
            let amount = _ev.detail.amount;
            const goldCounter = document.querySelectorAll(".GoldCounter");
            goldCounter.forEach(el => el.innerText = `Gold: ${amount}`);
        }
        addFightListeners() {
            Script.EventBus.addEventListener(Script.EVENT.GOLD_CHANGE, this.updateGoldCounter);
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_START, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.CHOOSE_STONE, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.CHOOSE_EUMLING, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.CHOOSE_ENCOUNTER, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_PREPARE, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.REWARDS_OPEN, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.EUMLING_LEVELUP_CHOOSE, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.SHOP_OPEN, this.switchUI);
            Script.EventBus.addEventListener(Script.EVENT.RUN_END, this.switchUI);
        }
    }
    Script.VisualizeGUI = VisualizeGUI;
})(Script || (Script = {}));
/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeGUI.ts" />
var Script;
/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeGUI.ts" />
(function (Script) {
    class Provider {
        static #data = new Script.Data();
        static #visualizer;
        static get data() {
            return this.#data;
        }
        static get visualizer() {
            return this.#visualizer;
        }
        static get GUI() {
            return this.#visualizer.getGUI();
        }
        static setVisualizer(_vis) {
            if (!_vis) {
                this.#visualizer = new Script.Visualizer;
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
/// <reference path="Visualisation/UI/VisualizeGUI.ts"/>
var Script;
/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />
/// <reference path="Visualisation/UI/VisualizeGUI.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    ƒ.Debug.info("Main Program Template running!");
    let visualizer;
    document.addEventListener("interactiveViewportStarted", start);
    async function initProvider() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR)
            return;
        await Script.Provider.data.load();
        //TODO load correct visualizer here
        Script.Provider.setVisualizer();
        visualizer = Script.Provider.visualizer;
        visualizer.initializeScene(Script.viewport);
        visualizer.drawScene();
        run();
    }
    function start(_event) {
        Script.viewport = _event.detail;
        initProvider();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.viewport.draw();
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
        run.start();
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
    let ANIMATION;
    (function (ANIMATION) {
        ANIMATION["IDLE"] = "idle";
        ANIMATION["MOVE"] = "move";
        ANIMATION["HURT"] = "hurt";
        ANIMATION["AFFECTED"] = "affected";
        ANIMATION["DIE"] = "die";
        ANIMATION["ATTACK"] = "attack";
        ANIMATION["SPELL"] = "spell";
    })(ANIMATION = Script.ANIMATION || (Script.ANIMATION = {}));
    let AnimationLink = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.Component;
        let _animation_decorators;
        let _animation_initializers = [];
        let _animation_extraInitializers = [];
        let _animType_decorators;
        let _animType_initializers = [];
        let _animType_extraInitializers = [];
        var AnimationLink = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _animation_decorators = [ƒ.serialize(ƒ.Animation)];
                _animType_decorators = [ƒ.serialize(ANIMATION)];
                __esDecorate(null, null, _animation_decorators, { kind: "field", name: "animation", static: false, private: false, access: { has: obj => "animation" in obj, get: obj => obj.animation, set: (obj, value) => { obj.animation = value; } }, metadata: _metadata }, _animation_initializers, _animation_extraInitializers);
                __esDecorate(null, null, _animType_decorators, { kind: "field", name: "animType", static: false, private: false, access: { has: obj => "animType" in obj, get: obj => obj.animType, set: (obj, value) => { obj.animType = value; } }, metadata: _metadata }, _animType_initializers, _animType_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                AnimationLink = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.linkedAnimations = new Map(); }
            constructor() {
                super();
                this.singleton = false;
                this.animation = __runInitializers(this, _animation_initializers, void 0);
                this.animType = (__runInitializers(this, _animation_extraInitializers), __runInitializers(this, _animType_initializers, void 0));
                __runInitializers(this, _animType_extraInitializers);
                if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                    return;
                ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, () => {
                    if (this.node instanceof ƒ.Graph) {
                        let link = this.node.getComponent(DataLink);
                        if (!link)
                            return;
                        if (!AnimationLink.linkedAnimations.has(link.id)) {
                            AnimationLink.linkedAnimations.set(link.id, new Map());
                        }
                        AnimationLink.linkedAnimations.get(link.id).set(this.animType, this.animation);
                    }
                });
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return AnimationLink = _classThis;
    })();
    Script.AnimationLink = AnimationLink;
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
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 2 }
                    }
                ]
            },
            {
                id: "knowledgestone", //TODO - 1 / 2 additional exp points
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 }
                    }
                ]
            },
            {
                id: "wonderstone", // should give 1 random eumling a random buff at fight start
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: {
                            type: Script.SPELL_TYPE.SHIELD, level: 1
                        },
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 }
                    }
                ]
            },
            {
                id: "punchstone", // Should deal 1 damage to a random enemy on fight start.
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1 } },
                        attack: { baseDamage: 1 },
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 2 } },
                        attack: { baseDamage: 1 },
                    }
                ]
            },
            {
                id: "warningstone", // Should give 1 random enemy weakness at fight start.
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.WEAKNESS, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.STRONGEST } },
                        spell: { type: Script.SPELL_TYPE.WEAKNESS, level: 1 }
                    }
                ]
            },
            {
                id: "glitterstone", //TODO - should reward 1 / 2 gold at the end of combat
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 2 }
                    }
                ]
            },
            {
                id: "pointystone", // Should give all Eumlinge in the last row thorns
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 1 }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 2 }
                    }
                ]
            },
            {
                id: "luckystone", // TODO - doubles the chance for rare stones
                abilityLevels: [
                    {
                        on: Script.EVENT.CHOOSE_STONE,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 1 }
                    },
                    {
                        on: Script.EVENT.CHOOSE_STONE,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 2 }
                    }
                ]
            },
            {
                id: "luckystone", // TODO - doubles the chance for rare stones
                abilityLevels: [
                    {
                        on: Script.EVENT.CHOOSE_STONE,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 1 }
                    },
                    {
                        on: Script.EVENT.CHOOSE_STONE,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 2 }
                    }
                ]
            },
            {
                id: "steppingstone", // Should deal 1 damage to enemies that move (currently to everyone hehe)
                abilityLevels: [
                    {
                        on: Script.EVENT.ENTITY_MOVE,
                        target: "target",
                        attack: { baseDamage: 1 }
                    },
                    {
                        on: Script.EVENT.ENTITY_MOVE,
                        target: "target",
                        attack: { baseDamage: 2 }
                    }
                ]
            },
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
            this.selections = new Map(); // not sure how to make this type-safe
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
            //move stuff
            this.moved = false;
            this.currentDirection = [-1, 0]; //facing towards player Side
            this.updateEntityData(_entity);
            Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_CREATE, target: this });
            Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_CREATED, target: this });
            this.registerEventListeners();
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
            //this.moves?; //move data of the entity
            //let occupiedSpots: Position[];
            //newGrid.forEachElement((el) => (occupiedSpots.push(el.position)));//get the positions from entities in the Grid
            //let newPos: Position = this.moveMePls(move, this.position, occupiedSpots);
            //this.position = newPos;
        }
        async tryToMove(_grid, maxAlternatives) {
            //let grid: Grid<Entity> = _grid;
            //check if the Entity has move data
            let moveData;
            moveData = this.select(this.moves, true)[0]; //TODO: funktioniert das???? // @Björn das sucht dir alle moves raus die es machen soll - du nimmst aber nur den ersten. Im Moment geht das weil da immer nur einer zurück kommt.
            if (moveData) { // @Björn hier ggf besser auf moveData testen
                // ✓
                for (let i = 0; i <= maxAlternatives && i <= moveData.blocked.attempts; i++) {
                    // @Björn hier fehlt noch die aktuelle rotation - die wird aktuell noch in nextPositionBasedOnThisRotation einberechnet, aber siehe meinen Kommentar dort
                    // Außerdem solltest du nicht mit blocked.attempts multiplizieren sondern blocked.rotateBy
                    // ✓
                    let rotateBy = moveData.rotateBy + i * moveData.blocked.rotateBy;
                    let nextPosition = Script.getPositionBasedOnMove(this.position, this.currentDirection, moveData.distance, rotateBy);
                    let nextDirection = Script.getNextDirection(rotateBy, this.currentDirection);
                    //check if the position is occupied or out of bounds
                    if (_grid.get(nextPosition) || Script.Grid.outOfBounds(nextPosition)) {
                        // @Björn hier nicht komplett abbrechen, nur zur for schleife zurück springen ("continue")
                        // sonst wird immer nur die standard variante getestet, nie die alternativen.
                        // ✓
                        continue;
                    }
                    else if (_grid.get(nextPosition) == undefined) { //spot is free
                        // @Björn hier noch den optionalen dritten parameter auf true setzen damit die entity nicht zweimal im grid ist
                        // ✓
                        //TODO: Fix entities being undefined.
                        _grid.set(nextPosition, this, true);
                        let oldPos = this.position;
                        this.position = nextPosition;
                        this.currentDirection = nextDirection;
                        // @Björn hier wäre der richtige Zeitpunkt für das EntityMove Event
                        // und auch das EntityMoved event, eines nach dem anderen. Ähnlich wie bei EntityDies / -Died
                        // denk daran die entsprechenden infos dem Event mitzugeben, also welche Entity sich bewegt und von wo nach wo usw.
                        // dann sollte das mit den abilities auch keine Fehler mehr schmeißen.
                        // ✓
                        await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_MOVE, cause: this, detail: { entity: this, position: this.position, oldPosition: oldPos, direction: this.currentDirection, step: moveData.distance } });
                        await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_MOVED, cause: this, detail: { entity: this, position: this.position, oldPosition: oldPos, direction: this.currentDirection, step: moveData.distance } });
                        this.moved = true;
                        return true;
                    }
                }
            }
            else { // if the entity has no move data we just pretend it already moved
                this.moved = true;
                return true;
            }
            // @Björn denk an default return
            return false;
        }
        /* @Björn okay, ich glaube ich verstehe wo du damit hin wolltest, ich glaube aber dass es sinnvoller
        wäre das wie folgt aufzuteilen:

        - eine Funktion um auf Basis einer Rotation die richtige direction zu bekommen
        - eine Funktion um auf Basis einer (aktuellen) position, rotation und Schrittlänge die nächste Position zurück zu geben, welche die erste Funktion nutzt

        Dann ist es auch nicht mehr Entity spezifisch und kann allgemeiner angewandt werden.
        Man könnte das in die Move.ts machen und dann hier aufrufen wo man es braucht.
        Außerdem sollte das so deutlich lesbarer und nachvollziehbarer werden denke ich.
        */
        async useSpell(_friendly, _opponent, _spells = this.select(this.spells, true), _targetsOverride) {
            if (!_spells)
                return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            await Script.executeSpell.call(this, _spells, _friendly, _opponent, _targetsOverride);
        }
        async useAttack(_friendly, _opponent, _attacks = this.select(this.attacks, true), _targetsOverride) {
            if (!_attacks || _attacks.length === 0)
                return;
            if (this.stunned) {
                // TODO: Event/Visualization for stunned
                return;
            }
            await Script.executeAttack.call(this, _attacks, _friendly, _opponent, _targetsOverride);
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
                    case Script.SELECTION_ORDER.RANDOM_EACH_ROUND:
                        this.selections.delete(_options);
                    case Script.SELECTION_ORDER.RANDOM_EACH_FIGHT:
                        let existingSelection = this.selections.get(_options);
                        if (!existingSelection) {
                            existingSelection = Script.chooseRandomElementsFromArray(_options.options, _options.selection.amount);
                            this.selections.set(_options, existingSelection);
                        }
                        selection.push(...existingSelection);
                        break;
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
            // TODO: should abilities be blocked by stun?
            for (let ability of this.abilities) {
                await Script.executeAbility.call(this, ability, this.#arena, _ev);
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
            this.selections.clear();
            this.removeEventListeners();
        }
    }
    Script.Entity = Entity;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Eumling extends Script.Entity {
        static { this.xpRequirements = [3, 6]; }
        #types = [];
        #xp = 0;
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
            this.#types.push(_type);
        }
        get type() {
            return this.#types.join("") + "-Eumling";
        }
        get xp() {
            return this.#xp;
        }
        get requiredXPForLevelup() {
            return Eumling.xpRequirements[this.#types.length - 1];
        }
        async addXP(_amount) {
            while (this.#types.length < 3 && _amount > 0) { // can only upgrade until lvl 3
                let requiredUntilLevelup = this.requiredXPForLevelup;
                if (requiredUntilLevelup === undefined)
                    return;
                if (_amount > 0) {
                    this.#xp += 1;
                    _amount--;
                    Script.EventBus.dispatchEvent({ type: Script.EVENT.EUMLING_XP_GAIN, target: this });
                    if (requiredUntilLevelup <= this.#xp) {
                        await this.levelup();
                    }
                }
            }
        }
        async levelup() {
            Script.EventBus.dispatchEvent({ type: Script.EVENT.EUMLING_LEVELUP_CHOOSE, target: this });
            let event = await Script.EventBus.awaitSpecificEvent(Script.EVENT.EUMLING_LEVELUP_CHOSEN);
            const chosenSpecial = event.detail.type;
            this.addType(chosenSpecial);
            this.#xp = 0;
            Script.EventBus.dispatchEvent({ type: Script.EVENT.EUMLING_LEVELUP, target: this });
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
                if (_ev.cause instanceof Script.Entity && !validTargets.includes(_ev.cause))
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
            if (_ev.cause && _ev.cause instanceof Script.Entity)
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
            await executeAttack([{ target: undefined, ..._ability.attack }], _arena.home, _arena.away, targets);
        }
        if (_ability.spell) {
            await executeSpell([{ target: undefined, ..._ability.spell }], _arena.home, _arena.away, targets);
        }
        await Script.EventBus.dispatchEvent({ type: Script.EVENT.TRIGGERED_ABILITY, cause: this, target: this, trigger: _ability });
    }
    Script.executeAbility = executeAbility;
    async function executeSpell(_spells, _friendly, _opponent, _targetsOverride) {
        if (!_spells)
            return;
        for (let spell of _spells) {
            let targets = _targetsOverride ?? Script.getTargets(spell.target, _friendly, _opponent, this);
            for (let target of targets) {
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_SPELL_BEFORE, trigger: spell, cause: this, target });
                await target.affect(spell, this);
                await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_SPELL, trigger: spell, cause: this, target });
            }
        }
    }
    Script.executeSpell = executeSpell;
    async function executeAttack(_attacks, _friendly, _opponent, _targetsOverride) {
        if (!_attacks || _attacks.length === 0)
            return;
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
    Script.executeAttack = executeAttack;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Stone {
        #level;
        #abilityLevels;
        #id;
        #triggers;
        #data;
        constructor(_data, _level = 0) {
            this.#triggers = new Set();
            this.removeEventListeners = () => {
                for (let trigger of this.#triggers) {
                    Script.EventBus.removeEventListener(trigger, this.abilityEventListener);
                }
                Script.EventBus.removeEventListener(Script.EVENT.RUN_END, this.removeEventListeners);
            };
            this.abilityEventListener = async (_ev) => {
                await this.runAbility(_ev);
            };
            this.#data = _data;
            this.#abilityLevels = _data.abilityLevels;
            this.level = _level;
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
        get level() {
            return this.#level;
        }
        get data() {
            return this.#data;
        }
        get id() {
            return this.#id;
        }
        addEventListeners() {
            for (let trigger of this.#triggers) {
                Script.EventBus.addEventListener(trigger, this.abilityEventListener);
            }
            Script.EventBus.addEventListener(Script.EVENT.RUN_END, this.removeEventListeners);
        }
        async runAbility(_ev) {
            let ability = this.#abilityLevels[this.#level];
            if (!ability)
                return;
            await Script.executeAbility.call(this, ability, Script.Fight.activeFight.arena, _ev);
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
        set(_pos, _el, _removeDuplicates = false) {
            if (Grid.outOfBounds(_pos))
                return undefined;
            if (_removeDuplicates && _el) {
                this.forEachElement((el, pos) => {
                    if (el === _el)
                        this.set(pos, undefined);
                });
            }
            return this.grid[_pos[0]][_pos[1]] = _el;
        }
        remove(_pos) {
            let currentElement = this.get(_pos);
            this.set(_pos, undefined);
            return currentElement;
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
        findElementPosition(_element) {
            let found;
            this.forEachElement((el, pos) => {
                if (el === _element)
                    found = pos;
            });
            return found;
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
    // TODO: replace this with a fudge timeout so it scales with gametime
    // Alternatively, make a second one that does that and replace where reasonable
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
    function randomRange(min = 0, max = 1) {
        const range = max - min;
        return Math.random() * range + min;
    }
    Script.randomRange = randomRange;
    function chooseRandomElementsFromArray(_array, _max, _exclude = []) {
        let filteredOptions = _array.filter((element) => !_exclude.includes(element));
        if (filteredOptions.length < _max) {
            return filteredOptions;
        }
        let result = [];
        for (let i = 0; i < _max; i++) {
            const index = Math.floor(Math.random() * filteredOptions.length);
            result.push(...filteredOptions.splice(index, 1));
        }
        return result;
    }
    Script.chooseRandomElementsFromArray = chooseRandomElementsFromArray;
    function createElementAdvanced(_type, _options = {}) {
        let el = document.createElement(_type);
        if (_options.id) {
            el.id = _options.id;
        }
        if (_options.classes) {
            el.classList.add(..._options.classes);
        }
        if (_options.innerHTML) {
            el.innerHTML = _options.innerHTML;
        }
        if (_options.attributes) {
            for (let attribute of _options.attributes) {
                el.setAttribute(attribute[0], attribute[1]);
            }
        }
        return el;
    }
    Script.createElementAdvanced = createElementAdvanced;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let PickSphere = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.Component;
        let _instanceExtraInitializers = [];
        let _get_radius_decorators;
        let _offset_decorators;
        let _offset_initializers = [];
        let _offset_extraInitializers = [];
        var PickSphere = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_radius_decorators = [ƒ.serialize(Number)];
                _offset_decorators = [ƒ.serialize(ƒ.Vector3)];
                __esDecorate(this, null, _get_radius_decorators, { kind: "getter", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                PickSphere = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(PickSphere); }
            constructor() {
                super();
                this.#radius = (__runInitializers(this, _instanceExtraInitializers), 1);
                this.#radiusSquared = 1;
                this.offset = __runInitializers(this, _offset_initializers, new ƒ.Vector3());
                __runInitializers(this, _offset_extraInitializers);
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
            }
            #radius;
            #radiusSquared;
            get radius() {
                return this.#radius;
            }
            set radius(_r) {
                this.#radius = _r;
                this.#radiusSquared = _r * _r;
            }
            get radiusSquared() {
                return this.#radiusSquared;
            }
            get mtxPick() {
                return this.node.mtxWorld.clone.translate(this.offset, true).scale(ƒ.Vector3.ONE(Math.max(this.radius * 2, 0.000001)));
            }
            drawGizmos(_cmpCamera) {
                ƒ.Gizmos.drawWireSphere(this.mtxPick, ƒ.Color.CSS("red"));
            }
            /**
             * finds all pickSpheres within the given ray
             * @param ray the ray to check against
             * @param options options
             */
            static pick(ray, options = {}) {
                const picks = [];
                options = { ...this.defaultOptions, ...options };
                for (let node of options.branch) {
                    let pckSph = node.getComponent(PickSphere);
                    if (!pckSph)
                        continue;
                    let distance = ray.getDistance(pckSph.mtxPick.translation);
                    if (distance.magnitudeSquared < pckSph.radiusSquared) {
                        picks.push(pckSph);
                    }
                }
                if (options.sortBy) {
                    let distances = new Map();
                    if (options.sortBy === "distanceToRayOrigin") {
                        picks.forEach(p => distances.set(p, ray.origin.getDistance(p.node.mtxWorld.translation)));
                    }
                    else if (options.sortBy === "distanceToRay") {
                        picks.forEach(p => distances.set(p, ray.getDistance(p.node.mtxWorld.translation).magnitudeSquared));
                    }
                    picks.sort((a, b) => distances.get(a) - distances.get(b));
                }
                return picks;
            }
            static get defaultOptions() {
                return {
                    branch: Script.viewport.getBranch(),
                };
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return PickSphere = _classThis;
    })();
    Script.PickSphere = PickSphere;
})(Script || (Script = {}));
var Script;
(function (Script) {
    /** Handles an entire run */
    class Run {
        #gold;
        #currentFight;
        /* TODO: This is a crutch for now, later we might come up with a better solution than hardcoding all encounter chances for each level */
        #levelDifficultyChances;
        #shopChance;
        constructor() {
            this.eumlings = [];
            this.stones = [];
            this.progress = 0;
            this.encountersUntilBoss = 10;
            this.#gold = 0;
            /* TODO: This is a crutch for now, later we might come up with a better solution than hardcoding all encounter chances for each level */
            this.#levelDifficultyChances = [
                [1, 0, 0],
                [0.9, 0.1, 0],
                [0.8, 0.2, 0],
                [0.7, 0.3, 0],
                [0.6, 0.3, 0.1],
                [0.5, 0.3, 0.2],
                [0.4, 0.3, 0.3],
                [0.2, 0.4, 0.4],
                [0, 0.5, 0.5],
                [0, 0, 1],
            ];
            this.#shopChance = [
                0,
                0,
                1,
                0,
                0.25,
                0.25,
                0.25,
                0,
                1,
                0,
            ];
            //#region Eventlisteners
            this.handleGoldAbility = async (_ev) => {
                if (!_ev.trigger)
                    return;
                if (_ev.trigger?.type !== Script.SPELL_TYPE.GOLD)
                    return;
                let amount = _ev.trigger.level ?? 1;
                await this.changeGold(amount);
            };
            this.handleStoneAddition = (_ev) => {
                let stone = _ev.detail.stone;
                if (!stone || !(stone instanceof Script.Stone))
                    return;
                this.stones.push(stone);
                stone.addEventListeners();
            };
            this.addEventListeners();
        }
        get gold() {
            return this.#gold;
        }
        async changeGold(_amt) {
            // if (this.#gold < -_amt) throw new Error("Can't spend more than you have!");
            this.#gold = Math.max(0, this.#gold + _amt);
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.GOLD_CHANGE, detail: { amount: this.#gold } });
        }
        //#region Prepare Run
        async start() {
            Run.currentRun = this;
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.RUN_PREPARE });
            await this.chooseEumling();
            await this.chooseStone();
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.RUN_START });
            for (this.progress = 0; this.progress < this.encountersUntilBoss; this.progress++) {
                let shouldContinue = await this.runStep();
                if (!shouldContinue)
                    return await this.end(false);
            }
            if (this.progress === this.encountersUntilBoss) {
                // bossfight here
            }
            await this.end();
        }
        async chooseEumling() {
            Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOOSE_EUMLING });
            let event = await Script.EventBus.awaitSpecificEvent(Script.EVENT.CHOSEN_EUMLING);
            this.eumlings.push(event.detail.eumling);
        }
        async chooseStone() {
            Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOOSE_STONE });
            await Script.EventBus.awaitSpecificEvent(Script.EVENT.CHOSEN_STONE);
        }
        //#endregion
        //#region Run
        async runStep() {
            let encounter = await this.chooseNextEncounter();
            if (encounter < 0) { //shop
                Script.EventBus.dispatchEvent({ type: Script.EVENT.SHOP_OPEN });
                await Script.EventBus.awaitSpecificEvent(Script.EVENT.SHOP_CLOSE);
                return true;
            }
            let nextFight = await this.nextEncounter(encounter);
            await this.prepareFight(nextFight);
            let result = await this.runFight();
            if (result === Script.FIGHT_RESULT.DEFEAT) {
                return false;
            }
            await this.giveRewards();
            return true;
        }
        //#region >  Prepare Fight
        async chooseNextEncounter() {
            const shopChance = this.#shopChance[this.progress];
            const levelChances = this.#levelDifficultyChances[this.progress];
            const options = [];
            if (Math.random() < shopChance) {
                options.push(-1);
            }
            while (options.length < 2) {
                let random = Math.random();
                for (let index = 0; index < levelChances.length; index++) {
                    const element = levelChances[index];
                    random -= element;
                    if (random <= 0) {
                        options.push(index);
                        break;
                    }
                }
            }
            Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOOSE_ENCOUNTER, detail: { options } });
            let event = await Script.EventBus.awaitSpecificEvent(Script.EVENT.CHOSEN_ENCOUNTER);
            return event.detail.encounter;
        }
        async nextEncounter(_difficulty) {
            if (_difficulty === -1) { // shop
                return undefined;
            }
            // TODO remember which fight(s) we had last and avoid that?
            let nextFight = Script.chooseRandomElementsFromArray(Script.Provider.data.fights.filter((data) => data.difficulty === _difficulty), 1)[0];
            return nextFight;
        }
        async prepareFight(_fight) {
            let eumlingsGrid = new Script.Grid();
            this.#currentFight = new Script.Fight(_fight, eumlingsGrid);
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_PREPARE, detail: { fight: this.#currentFight } });
            await Script.EventBus.awaitSpecificEvent(Script.EVENT.FIGHT_PREPARE_COMPLETED);
        }
        //#endregion
        //#region > Run Fight
        async runFight() {
            // actually run the fight
            const result = await this.#currentFight.run();
            return result;
        }
        async giveRewards() {
            // give rewards
            let gold = 1;
            let xp = 1;
            let prevEnemyAmt = this.#currentFight.enemyCountAtStart;
            let remainingEnemyAmt = this.#currentFight.arena.away.occupiedSpots;
            let defeatedEnemyAmt = prevEnemyAmt - remainingEnemyAmt;
            gold += remainingEnemyAmt;
            xp += defeatedEnemyAmt;
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.REWARDS_OPEN, detail: { gold, xp } });
            await Script.EventBus.awaitSpecificEvent(Script.EVENT.REWARDS_CLOSE);
            await this.changeGold(gold);
        }
        //#endregion
        //#endregion
        async end(_success = true) {
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.RUN_END, detail: { success: _success } });
            this.removeEventListeners();
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_SPELL, this.handleGoldAbility);
            Script.EventBus.addEventListener(Script.EVENT.CHOSEN_STONE, this.handleStoneAddition);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_SPELL, this.handleGoldAbility);
        }
    }
    Script.Run = Run;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class VisualizeFight {
        constructor(_fight) {
            this.#listeners = new Map();
            this.eventListener = (_ev) => {
                this.#listeners.get(_ev.type)?.call(this, _ev);
            };
            let awayGrid = new Script.Grid();
            _fight.arena.away.forEachElement((entity, pos) => {
                awayGrid.set(pos, Script.Provider.visualizer.getEntity(entity), true);
            });
            this.away = new Script.VisualizeGrid(awayGrid, "away");
            let homeGrid = new Script.Grid();
            _fight.arena.home.forEachElement((entity, pos) => {
                homeGrid.set(pos, Script.Provider.visualizer.getEntity(entity), true);
            });
            this.home = new Script.VisualizeGrid(homeGrid, "home");
            Script.Provider.visualizer.addToScene(this.away);
            Script.Provider.visualizer.addToScene(this.home);
            Script.Provider.visualizer.drawScene();
            this.addEventListeners();
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
        async nukeGrid() {
            this.home.nuke();
            this.away.nuke();
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
            await this.nukeGrid();
            console.log("Fight End!");
        }
        entityAdded(_ev) {
            const entity = _ev.target;
            const side = _ev.detail.side;
            const pos = _ev.detail.pos;
            if (!entity || !side || !pos)
                return;
            let sideGrid = side === "home" ? this.home : this.away;
            sideGrid.addEntityToGrid(Script.Provider.visualizer.getEntity(entity), pos);
        }
        entityRemoved(_ev) {
            const entity = _ev.target;
            if (!entity)
                return;
            let entityVis = Script.Provider.visualizer.getEntity(entity);
            let pos = this.home.grid.findElementPosition(entityVis);
            if (pos)
                this.home.removeEntityFromGrid(pos, true);
            pos = this.away.grid.findElementPosition(entityVis);
            if (pos)
                this.away.removeEntityFromGrid(pos, true);
        }
        addEventListeners() {
            this.#listeners.set(Script.EVENT.FIGHT_START, this.fightStart);
            this.#listeners.set(Script.EVENT.FIGHT_END, this.fightEnd);
            this.#listeners.set(Script.EVENT.ROUND_START, this.roundStart);
            this.#listeners.set(Script.EVENT.ROUND_END, this.roundEnd);
            this.#listeners.set(Script.EVENT.ENTITY_ADDED, this.entityAdded);
            this.#listeners.set(Script.EVENT.ENTITY_REMOVED, this.entityRemoved);
            this.#listeners.set(Script.EVENT.ENTITY_DIED, this.entityRemoved);
            for (let [event] of this.#listeners) {
                Script.EventBus.addEventListener(event, this.eventListener);
            }
        }
        removeEventListeners() {
            for (let [event] of this.#listeners) {
                Script.EventBus.removeEventListener(event, this.eventListener);
            }
        }
        #listeners;
    }
    Script.VisualizeFight = VisualizeFight;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizeEntity extends ƒ.Node /*implements VisualizeEntity*/ {
        constructor(_entity) {
            super("entity");
            this.updateTmpText = () => {
                if (!this.tmpText)
                    return;
                console.log("updateTmpText", this.entity);
                let effectText = "";
                this.entity.activeEffects.forEach((value, type) => { if (value > 0)
                    effectText += `${type}: ${value}\n`; });
                effectText += `${this.entity.currentHealth} / ${this.entity.health} ♥️`;
                console.log(effectText);
                this.tmpText.texture.text = effectText;
            };
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
            this.addEventListeners();
        }
        // async idle(): Promise<void> {
        //     // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
        //     await waitMS(200);
        // }
        //#region Do something
        async attack(_ev) {
            console.log("entity visualizer: attack", { attacker: this.entity, attack: _ev.trigger, targets: _ev.detail.targets });
            await this.playAnimationIfPossible(Script.ANIMATION.ATTACK);
        }
        async move(_ev) {
            //this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3());
            console.log("entity visualizer: move", { entity: _ev.detail.entity, oldPosition: _ev.detail.oldPosition, position: _ev.detail.position, direction: _ev.detail.direction, step: _ev.detail.step });
            await this.playAnimationIfPossible(Script.ANIMATION.MOVE);
            //await EventBus.dispatchEvent({ type: EVENT.ENTITY_MOVED, cause: this.entity, detail: {entity: this.entity, position: this.entity.position, oldPosition: _ev.detail.oldPosition, direction: _ev.detail.currentDirection, step: _ev.detail.step}});
        }
        async useSpell(_ev) {
            console.log("entity visualizer: spell", { caster: this.entity, spell: _ev.trigger, targets: _ev.detail?.targets });
            await this.playAnimationIfPossible(Script.ANIMATION.SPELL);
        }
        //#endregion
        //#region Something happened
        async getHurt(_ev) {
            await this.playAnimationIfPossible(Script.ANIMATION.HURT);
        }
        async getAffected(_ev) {
            await this.playAnimationIfPossible(Script.ANIMATION.AFFECTED);
        }
        async die(_ev) {
            await this.playAnimationIfPossible(Script.ANIMATION.DIE);
            // TODO: this is a temp, should probably better be done in the visualizer above this, not this one.
            // this.removeAllChildren();
            // this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("hotpink");
            // await waitMS(1000);
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
            //TODO: remove the Entity from Scene Graph if this is an enemy, Player should not be removed just repositioned in the next run
            // this.removeAllChildren();
            // console.log("entity visualizer null: updateVisuals", this.entity);
            // await waitMS(200);
        }
        async loadModel(_id) {
            let model = new ƒ.Node(_id);
            let original = Script.DataLink.linkedNodes.get(_id);
            //if the model is not found use a placeholder
            try {
                await model.deserialize(original.serialize());
                this.cmpAnimation = model.getChild(0)?.getComponent(ƒ.ComponentAnimation);
                this.defaultAnimation = this.cmpAnimation?.animation;
            }
            catch (error) {
                model = this.givePlaceholderPls();
                console.warn(`Model with ID: ${_id} not found, using placeholder instead 👉👈`);
            }
            this.addChild(model);
            // TODO: this is a temp vis for all the info, we need to remove this
            let entityInfoGraph = Script.DataLink.linkedNodes.get("entityInfo");
            let textNode = new ƒ.Node("text");
            await textNode.deserialize(entityInfoGraph.serialize());
            this.addChild(textNode);
            this.tmpText = textNode.getComponent(ƒ.ComponentText);
            this.updateTmpText();
        }
        //retuns a placeholder if needed
        givePlaceholderPls() {
            let placeholder = new ƒ.Node("Placeholder");
            let mesh = new ƒ.MeshCube("EntityMesh");
            let material = new ƒ.Material("EntityMat", ƒ.ShaderLitTextured);
            placeholder.addComponent(new ƒ.ComponentMesh(mesh));
            placeholder.addComponent(new ƒ.ComponentMaterial(material));
            placeholder.addComponent(new ƒ.ComponentTransform());
            return placeholder;
        }
        async playAnimationIfPossible(_anim) {
            if (!this.cmpAnimation)
                return this.showFallbackText(_anim);
            let animation = Script.AnimationLink.linkedAnimations.get(this.entity.id)?.get(_anim);
            if (!animation)
                return this.showFallbackText(_anim);
            this.cmpAnimation.animation = animation;
            this.cmpAnimation.time = 0;
            console.log({ totalTime: animation.totalTime });
            await Script.waitMS(animation.totalTime);
            this.cmpAnimation.animation = this.defaultAnimation; // TODO: check if we should instead default back to idle or nothing at all
        }
        async showFallbackText(_text) {
            let node = await Script.getCloneNodeFromRegistry(_text);
            if (node)
                this.addChild(node);
            await Script.waitMS(1000);
            if (node)
                this.removeChild(node);
        }
        // @Björn das Problem ist, dass wenn du es so aufrufst, du `this` verlierst.
        // um das zu fixen musst du eine lambda funktion benutzen, also private updatePosition = () => { this.move() }
        // wie es auch bei eventListener unten gemacht ist. Und der bekommt aktuell ja auch noch jedes Event mit, nicht nur das von der eigenen Entity.
        // In dem Fall kannst du es aber auch einfach in die eventListener/handleEvent Systematik unten mit einbauen, da wird das alles schon behandelt.
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
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_HURT, this.updateTmpText);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_AFFECTED, this.updateTmpText);
            Script.EventBus.addEventListener(Script.EVENT.ROUND_END, this.updateTmpText);
            Script.EventBus.addEventListener(Script.EVENT.ROUND_START, this.updateTmpText);
            // @Björn besser EntityMove (ohne d) für die visuelle Darstellung nutzen. denk auch dran den wieder zu entfernen
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_MOVE, this.eventListener);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.RUN_END, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_ATTACK, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_HURT, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_AFFECTED, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_DIES, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_MOVE, this.eventListener);
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
                    // @Björn hier könntest du die move einbauen
                    case Script.EVENT.ENTITY_MOVE: {
                        await this.move(_ev);
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
                    case Script.EVENT.RUN_END: {
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
    class VisualizeGrid extends ƒ.Node {
        constructor(_grid, _side) {
            super("VisualizeGrid");
            this.eventListener = async (_ev) => {
                await this.handleEvent(_ev);
            };
            this.grid = _grid;
            if (_side === "home" || "away") {
                this.side = _side;
            }
            else {
                throw new Error("Use home or away for the side parameter");
            }
            if (this.side === "away") {
                this.sideNode = Script.Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
            }
            else if (this.side === "home") {
                this.sideNode = Script.Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
            }
            this.addComponent(new ƒ.ComponentTransform());
            //set the positions of the entities in the grid
            this.grid.forEachElement((element, pos) => {
                this.addEntityToGrid(element, pos, false);
            });
            this.registerEventListeners();
        }
        addEntityToGrid(_entity, _pos, _removeExisting = true, _anchor) {
            if (Script.Grid.outOfBounds(_pos))
                return;
            if (_removeExisting) {
                this.removeEntityFromGrid(_pos, false);
            }
            // remove this entity if it's already somewhere in the grid
            this.grid.forEachElement((entity, pos) => {
                if (entity === _entity)
                    this.removeEntityFromGrid(pos, false);
            });
            // if (!_anchor) {
            //     /**Anchors are named from 0-8 */
            //     _anchor = this.getAnchor(_pos[0], _pos[1]);
            // }
            //get the Positions from the placeholders and translate the entities to it
            this.moveEntityToAnchor(_entity, _pos);
            this.addChild(_entity);
            this.grid.set(_pos, _entity, true);
        }
        removeEntityFromGrid(_pos, _removeListeners) {
            if (Script.Grid.outOfBounds(_pos))
                return;
            let elementToRemove = this.grid.get(_pos);
            if (!elementToRemove)
                return;
            this.grid.remove(_pos);
            this.removeChild(elementToRemove);
            if (_removeListeners)
                elementToRemove.removeEventListeners();
        }
        moveEntityToAnchor(_entity, position) {
            let _anchor = this.getAnchor(position[0], position[1]);
            //get the Positions from the placeholders and translate the entity to it
            let pos3 = _anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;
            console.log(_entity);
            _entity.mtxLocal.translation = pos3.clone;
            this.grid.set(position, _entity, true);
        }
        getAnchor(_x, _z) {
            let anchor;
            let pointer = _z * 3 + _x;
            //console.log("pointer: " + pointer);
            anchor = this.sideNode.getChildByName(pointer.toString());
            return anchor;
        }
        nuke() {
            this.grid.forEachElement((_el, pos) => {
                this.removeEntityFromGrid(pos, true);
            });
        }
        // @Björn auch hier das problem dass du den Bezug zu "this" verlierst. 
        // Lambda Funktionsschreibweise (s. VisualizeEntity.updatePosition Kommentar) ist der Weg das zu reparieren.
        //TODO: check why move is not being called
        async move(_ev) {
            //gets the moving entity and moves it
            this.moveEntityToAnchor(this.grid.get(_ev.detail.oldPosition), _ev.detail.position);
        }
        registerEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_MOVED, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.RUN_END, this.eventListener);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_MOVED, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.RUN_END, this.eventListener);
        }
        async handleEvent(_ev) {
            // this entity is doing something
            switch (_ev.type) {
                case Script.EVENT.ENTITY_MOVED: {
                    await this.move(_ev);
                    break;
                }
                case Script.EVENT.RUN_END: {
                    this.removeEventListeners;
                }
            }
        }
    }
    Script.VisualizeGrid = VisualizeGrid;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class EumlingLevelupUI extends Script.UILayer {
        static { this.orientationInfo = new Map([
            ["R", "Realistisch"],
            ["I", "Investigativ / Forschend"],
            ["A", "Artistisch / Künstlerisch"],
            ["S", "Sozial"],
            ["E", "Enterprising / Unternehmerisch"],
            ["C", "Conventional / Traditionell"],
        ]); }
        constructor() {
            super();
            this.selectOption = (_ev) => {
                const element = _ev.currentTarget;
                this.selectedOption = element.dataset.option;
                this.confirmButton.disabled = false;
                for (let element of document.querySelectorAll(".LevelupOption")) {
                    element.classList.remove("selected");
                }
                element.classList.add("selected");
            };
            this.confirm = () => {
                if (!this.selectedOption)
                    return;
                Script.Provider.GUI.removeTopmostUI();
                Script.EventBus.dispatchEvent({ type: Script.EVENT.EUMLING_LEVELUP_CHOSEN, detail: { type: this.selectedOption } });
            };
            this.element = document.getElementById("EumlingLevelup");
            this.eumlingElement = document.getElementById("EumlingLevelupEumling");
            this.optionsElement = document.getElementById("EumlingLevelupOptions");
            this.infoElement = document.getElementById("EumlingLevelupInfo");
            this.confirmButton = document.getElementById("EumlingLevelupConfirm");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.confirmButton.disabled = true;
            this.eumling = _ev.target;
            let specialisationOptions = this.eumling.types.length === 1 ? ["A", "I"] : ["C", "E"];
            this.eumlingElement.replaceChildren(Script.EumlingUIElement.getUIElement(this.eumling).element);
            const optionElements = [];
            for (let option of specialisationOptions) {
                const elem = Script.createElementAdvanced("div", {
                    classes: ["LevelupOption"],
                    innerHTML: `<span>+ ${option}</span>
                    <span>${EumlingLevelupUI.orientationInfo.get(option)}</span>`,
                    attributes: [["data-option", option]],
                });
                optionElements.push(elem);
                elem.addEventListener("click", this.selectOption);
            }
            this.optionsElement.replaceChildren(...optionElements);
        }
        addEventListeners() {
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners() {
            this.confirmButton.removeEventListener("click", this.confirm);
        }
    }
    Script.EumlingLevelupUI = EumlingLevelupUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    class FightPrepUI extends Script.UILayer {
        constructor() {
            super();
            this.eumlingElements = new Map();
            this.pickEumling = (_ev) => {
                const element = _ev.currentTarget;
                let eumling;
                this.eumlingElements.forEach((_element, _eumling) => {
                    _element.classList.remove("selected");
                    if (_element === element) {
                        eumling = _eumling;
                    }
                });
                if (!eumling)
                    return;
                element.classList.add("selected");
                this.selectedEumling = eumling;
                this.selectedSpace = undefined;
            };
            this.clickCanvas = (_ev) => {
                const ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_ev.clientX, _ev.clientY));
                const picks = Script.PickSphere.pick(ray, { sortBy: "distanceToRay" });
                if (!picks || picks.length === 0)
                    return;
                const pick = picks[0];
                if (this.selectedEumling) {
                    // place eumling in map
                    const posId = parseInt(pick.node.name);
                    Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_ADDED, target: this.selectedEumling, detail: { side: "home", pos: [posId % 3, Math.floor(posId / 3)] } });
                    if (!this.selectedSpace) {
                        // hide from UI
                        let uiElement = this.eumlingElements.get(this.selectedEumling);
                        uiElement.classList.remove("selected");
                        uiElement.classList.add("hidden");
                    }
                    this.selectedSpace = pick.node;
                    this.startButton.disabled = false;
                }
            };
            this.returnEumling = (_ev) => {
                if (_ev.target.id !== "FightPrepEumlings")
                    return;
                if (!this.selectedEumling)
                    return;
                // remove from field
                Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_REMOVED, target: this.selectedEumling });
                // add to UI
                this.eumlingElements.get(this.selectedEumling).classList.remove("hidden");
                this.selectedEumling = undefined;
                this.selectedSpace = undefined;
                if (this.eumlingElements.values().reduce((prev, curr) => prev + (curr.classList.contains("hidden") ? 1 : 0), 0) === 0) {
                    this.startButton.disabled = true;
                }
            };
            this.startFight = (_ev) => {
                Script.EventBus.dispatchEvent({ type: Script.EVENT.FIGHT_PREPARE_COMPLETED });
            };
            this.element = document.getElementById("FightPrep");
            this.stoneWrapper = document.getElementById("FightPrepStones");
            this.eumlingWrapper = document.getElementById("FightPrepEumlings");
            this.startButton = document.getElementById("FightStart");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.startButton.disabled = true;
            this.initStones();
            this.initEumlings();
        }
        initStones() {
            const stones = [];
            for (let stone of Script.Run.currentRun.stones) {
                stones.push(Script.StoneUIElement.getUIElement(stone).element);
            }
            this.stoneWrapper.replaceChildren(...stones);
        }
        initEumlings() {
            for (let eumling of Script.Run.currentRun.eumlings) {
                const element = Script.EumlingUIElement.getUIElement(eumling).element;
                this.eumlingElements.set(eumling, element);
                element.addEventListener("click", this.pickEumling);
            }
            this.eumlingWrapper.replaceChildren(...this.eumlingElements.values());
        }
        addEventListeners() {
            document.getElementById("GameCanvas").addEventListener("click", this.clickCanvas);
            this.startButton.addEventListener("click", this.startFight);
            document.getElementById("FightPrepEumlings").addEventListener("click", this.returnEumling);
        }
        removeEventListeners() {
            document.getElementById("GameCanvas").removeEventListener("click", this.clickCanvas);
            this.startButton.removeEventListener("click", this.startFight);
            document.getElementById("FightPrepEumlings").removeEventListener("click", this.returnEumling);
            this.eumlingElements.forEach(element => element.removeEventListener("click", this.pickEumling));
        }
    }
    Script.FightPrepUI = FightPrepUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class FightRewardUI extends Script.UILayer {
        constructor() {
            super();
            this.eumlings = new Map();
            this.clickOnEumling = (_ev) => {
                if (this.xp <= 0)
                    return;
                let target = _ev.target;
                let eumling = this.eumlings.get(target);
                eumling.addXP(1);
                this.xp--;
                this.updateXPText();
                if (this.xp <= 0) {
                    this.continueButton.disabled = false;
                }
            };
            this.convert = () => {
                Script.Run.currentRun.changeGold(this.xp);
                this.gold += this.xp;
                document.getElementById("FightRewardRewards").querySelector(".Gold").innerHTML = `+${this.gold} Gold`;
                this.xp = 0;
                this.continueButton.disabled = false;
                this.updateXPText();
            };
            this.finishRewards = () => {
                Script.EventBus.dispatchEvent({ type: Script.EVENT.REWARDS_CLOSE });
            };
            this.element = document.getElementById("FightReward");
            this.rewardsOverivew = document.getElementById("FightRewardRewards");
            this.continueButton = document.getElementById("FightRewardContinue");
            this.convertButton = document.getElementById("FightRewardConvert");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            let { gold, xp, stones } = _ev.detail;
            const rewardIcons = [];
            if (gold) {
                rewardIcons.push(Script.createElementAdvanced("div", {
                    innerHTML: `+${gold} Gold`,
                    classes: ["FightRewardIcon", "Gold"]
                }));
                this.gold = gold;
            }
            if (xp) {
                rewardIcons.push(Script.createElementAdvanced("div", {
                    innerHTML: `+${xp} XP`,
                    classes: ["FightRewardIcon", "XP"]
                }));
                this.xp = xp;
            }
            if (stones) {
                for (let stone of stones) {
                    rewardIcons.push(Script.createElementAdvanced("div", {
                        innerHTML: `${stone.id}`,
                        classes: ["FightRewardIcon", "Stone"]
                    }));
                }
            }
            this.rewardsOverivew.replaceChildren(...rewardIcons);
            for (let eumling of Script.Run.currentRun.eumlings) {
                let uiElement = Script.EumlingUIElement.getUIElement(eumling);
                this.eumlings.set(uiElement.element, uiElement.eumling);
                uiElement.element.classList.remove("hidden");
                uiElement.element.addEventListener("click", this.clickOnEumling);
            }
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
            this.updateXPText();
            this.continueButton.disabled = true;
            this.convertButton.disabled = false;
        }
        onShow() {
            super.onShow();
            this.addEventListeners();
            for (let element of this.eumlings.keys()) {
                element.addEventListener("click", this.clickOnEumling);
            }
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
        }
        onHide() {
            super.onHide();
            this.removeEventListeners();
        }
        updateXPText() {
            document.getElementById("FightRewardXPAmount").innerText = this.xp === 0 ?
                `No more XP to distribute` :
                `Distribute ${this.xp}XP`;
            this.convertButton.disabled = this.xp === 0;
        }
        addEventListeners() {
            this.continueButton.addEventListener("click", this.finishRewards);
            this.convertButton.addEventListener("click", this.convert);
        }
        removeEventListeners() {
            for (let element of this.eumlings.keys()) {
                element.removeEventListener("click", this.clickOnEumling);
            }
            this.continueButton.removeEventListener("click", this.finishRewards);
            this.convertButton.removeEventListener("click", this.convert);
        }
    }
    Script.FightRewardUI = FightRewardUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class MainMenuUI extends Script.UILayer {
        constructor() {
            super();
            this.element = document.getElementById("MainMenu");
        }
        addEventListeners() {
        }
        removeEventListeners() {
        }
    }
    Script.MainMenuUI = MainMenuUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class MapUI extends Script.UILayer {
        constructor() {
            super();
            this.selectionDone = async () => {
                this.submitBtn.disabled = true;
                for (let opt of this.optionElements) {
                    if (opt.classList.contains("selected")) {
                        opt.classList.add("center");
                    }
                    else {
                        opt.classList.add("remove");
                    }
                }
                this.optionElements.find((el) => el.classList.contains("selected"));
                this.element.classList.add("no-interact");
                await Script.waitMS(1000);
                Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOSEN_ENCOUNTER, detail: { encounter: this.selectedEncounter } });
            };
            this.element = document.getElementById("Map");
            this.submitBtn = document.getElementById("MapActionButton");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex);
            this.updateProgress();
            this.displayEncounters(_ev);
            this.element.classList.remove("no-interact");
        }
        updateProgress() {
            const inner = document.getElementById("MapProgressBarCurrent");
            const progress = Script.Run.currentRun.progress / Script.Run.currentRun.encountersUntilBoss;
            inner.style.height = progress * 100 + "";
        }
        displayEncounters(_ev) {
            let options = _ev.detail.options;
            this.optionElements = [];
            for (let option of options) {
                const elem = Script.createElementAdvanced("div", { classes: ["MapOption"] });
                if (option < 0) {
                    // shop
                    elem.innerText = "Shop";
                }
                else {
                    elem.innerText = `Fight lvl ${option + 1}`;
                }
                elem.addEventListener("click", () => {
                    for (let opt of this.optionElements) {
                        opt.classList.remove("selected");
                    }
                    elem.classList.add("selected");
                    this.selectedEncounter = option;
                    this.submitBtn.disabled = false;
                });
                this.optionElements.push(elem);
            }
            document.getElementById("MapOptions").replaceChildren(...this.optionElements);
            this.submitBtn.disabled = true;
        }
        addEventListeners() {
            this.submitBtn.addEventListener("click", this.selectionDone);
        }
        removeEventListeners() {
        }
    }
    Script.MapUI = MapUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class OptionsUI extends Script.UILayer {
        constructor() {
            super();
            this.element = document.getElementById("MainMenu");
        }
        addEventListeners() {
        }
        removeEventListeners() {
        }
    }
    Script.OptionsUI = OptionsUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class RunEndUI extends Script.UILayer {
        constructor() {
            super();
            this.close = () => {
                location.reload();
            };
            this.element = document.getElementById("RunEnd");
            this.continueButton = document.getElementById("Restart");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            document.getElementById("RunEndInner").innerHTML =
                _ev.detail.success ?
                    `<h2>Success!</h2>
            <p>You won! :&gt;</p>
            <p>Try again?</p>` :
                    `<h2>Defeat!</h2>
            <p>You lost. :(;</p>
            <p>Try again?</p>`;
        }
        addEventListeners() {
            this.continueButton.addEventListener("click", this.close);
        }
        removeEventListeners() {
            this.continueButton.removeEventListener("click", this.close);
        }
    }
    Script.RunEndUI = RunEndUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    const COST = {
        HEAL_EUMLING: 1,
        BUY_LVL1: 2,
        BUY_LVL2: 3,
        UPGRADE_STONE: 2,
        REFRESH: 1,
    };
    class ShopUI extends Script.UILayer {
        constructor() {
            super();
            this.close = () => {
                Script.EventBus.dispatchEvent({ type: Script.EVENT.SHOP_CLOSE });
            };
            this.refresh = () => {
                if (Script.Run.currentRun.gold < COST.REFRESH)
                    return;
                Script.Run.currentRun.changeGold(-COST.REFRESH);
                this.setupStonesToBuy();
            };
            this.element = document.getElementById("Shop");
            this.closeButton = document.getElementById("ShopClose");
            this.stonesWrapper = document.getElementById("ShopStones");
            this.stonesRefreshButton = document.getElementById("ShopStonesRefresh");
            this.stoneUpgradeWrapper = document.getElementById("ShopStoneUpgrades");
            this.eumlingHealWrapper = document.getElementById("ShopEumlingHeal");
        }
        onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.setupStonesToBuy();
            this.setupStonesToUpgrade();
            this.initEumlingHealing();
        }
        setupStonesToBuy() {
            const existingStones = Script.Run.currentRun.stones.map((stone) => stone.data);
            const newStones = Script.chooseRandomElementsFromArray(Script.Provider.data.stones, 2, existingStones);
            if (newStones.length === 0) {
                this.stonesWrapper.replaceChildren(Script.createElementAdvanced("p", { innerHTML: "No more stones available." }));
                return;
            }
            const newStoneElements = [];
            for (let stoneData of newStones) {
                let level = (Math.random() < 0.2) ? 1 : 0;
                let cost = level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
                let stone = new Script.Stone(stoneData, level);
                let uiStoneElement = Script.StoneUIElement.getUIElement(stone);
                let wrapper = Script.createElementAdvanced("div", {
                    classes: ["BuyStone", "ShopOption"],
                    attributes: [["data-level", level.toString()]],
                    innerHTML: `<span>${cost} Gold</span>`,
                });
                wrapper.prepend(uiStoneElement.element);
                newStoneElements.push(wrapper);
                wrapper.addEventListener("click", () => {
                    if (Script.Run.currentRun.gold < cost)
                        return;
                    Script.Run.currentRun.changeGold(-cost);
                    Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOSEN_STONE, detail: { stone } });
                    wrapper.remove();
                });
            }
            this.stonesWrapper.replaceChildren(...newStoneElements);
        }
        setupStonesToUpgrade() {
            const upgradeableStones = Script.chooseRandomElementsFromArray(Script.Run.currentRun.stones, Infinity, Script.Run.currentRun.stones.filter(stone => stone.level === 1));
            if (upgradeableStones.length === 0) {
                this.stoneUpgradeWrapper.replaceChildren(Script.createElementAdvanced("p", { innerHTML: "No more stones upgradeable." }));
                return;
            }
            const upgradeStoneElements = [];
            for (let stone of upgradeableStones) {
                const element = Script.createElementAdvanced("div", {
                    innerHTML: `<span>Levelup: ${COST.UPGRADE_STONE} Gold</span>`,
                    classes: ["ShopOption"],
                });
                element.prepend(Script.StoneUIElement.getUIElement(stone).element);
                upgradeStoneElements.push(element);
                element.addEventListener("click", () => {
                    if (Script.Run.currentRun.gold < COST.UPGRADE_STONE)
                        return;
                    stone.level++;
                    Script.Run.currentRun.changeGold(-COST.UPGRADE_STONE);
                    element.remove();
                });
            }
            this.stoneUpgradeWrapper.replaceChildren(...upgradeStoneElements);
        }
        initEumlingHealing() {
            const healableEumlings = Script.Run.currentRun.eumlings.filter(eumling => eumling.currentHealth < eumling.health);
            if (healableEumlings.length === 0) {
                this.eumlingHealWrapper.replaceChildren(Script.createElementAdvanced("p", { innerHTML: "No Eumlings need healing." }));
                return;
            }
            const elements = [];
            for (let eumling of healableEumlings) {
                const wrapper = Script.createElementAdvanced("div", {
                    classes: ["ShopOption"],
                    innerHTML: `<span>+♥️: ${COST.HEAL_EUMLING} Gold</span>`,
                });
                wrapper.prepend(Script.EumlingUIElement.getUIElement(eumling).element);
                wrapper.addEventListener("click", () => {
                    if (Script.Run.currentRun.gold < COST.HEAL_EUMLING)
                        return;
                    Script.Run.currentRun.changeGold(-COST.HEAL_EUMLING);
                    eumling.affect({ type: Script.SPELL_TYPE.HEAL, level: 1, target: undefined });
                    if (eumling.currentHealth >= eumling.health)
                        wrapper.remove();
                });
            }
            this.eumlingHealWrapper.replaceChildren(...elements);
        }
        addEventListeners() {
            this.closeButton.addEventListener("click", this.close);
            this.stonesRefreshButton.addEventListener("click", this.refresh);
        }
        removeEventListeners() {
            this.closeButton.removeEventListener("click", this.close);
            this.stonesRefreshButton.removeEventListener("click", this.refresh);
        }
    }
    Script.ShopUI = ShopUI;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class UIElement {
    }
    Script.UIElement = UIElement;
})(Script || (Script = {}));
/// <reference path="UIElement.ts" />
var Script;
/// <reference path="UIElement.ts" />
(function (Script) {
    class EumlingUIElement extends Script.UIElement {
        #element;
        #eumling;
        constructor(_eumling) {
            super();
            this.update = () => {
                this.#element.innerHTML = `
            <span class="">${this.#eumling.type}</span>
            <span class="">${this.#eumling.currentHealth} / ${this.#eumling.health}♥️</span>
            <span class="">(${this.#eumling.xp} / ${this.#eumling.requiredXPForLevelup}XP)</span>
            `;
            };
            this.#eumling = _eumling;
            this.#element = Script.createElementAdvanced("div", {
                classes: ["EumlingUIElement"],
            });
            this.update();
            this.addEventListeners();
        }
        static #elements = new Map();
        static getUIElement(_obj) {
            if (!this.#elements.has(_obj)) {
                this.#elements.set(_obj, new EumlingUIElement(_obj));
            }
            return this.#elements.get(_obj);
        }
        get element() {
            return this.#element;
        }
        get eumling() {
            return this.#eumling;
        }
        addEventListeners() {
            // TODO: when to remove these listeners?
            Script.EventBus.addEventListener(Script.EVENT.EUMLING_XP_GAIN, this.update);
            Script.EventBus.addEventListener(Script.EVENT.EUMLING_LEVELUP, this.update);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_HURT, this.update);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_HEALED, this.update);
        }
    }
    Script.EumlingUIElement = EumlingUIElement;
})(Script || (Script = {}));
/// <reference path="UIElement.ts" />
var Script;
/// <reference path="UIElement.ts" />
(function (Script) {
    class StoneUIElement extends Script.UIElement {
        #element;
        #stone;
        constructor(_stone) {
            super();
            this.update = () => {
                this.#element.innerHTML = `
            <span class="">${this.#stone.id}</span>
            <span class="">Level ${this.#stone.level + 1}</span>
            `;
            };
            this.animate = async (_ev) => {
                if (_ev.cause !== this.#stone)
                    return;
                this.#element.classList.add("animate");
                await Script.waitMS(1000);
                this.#element.classList.remove("animate");
            };
            this.#stone = _stone;
            this.#element = Script.createElementAdvanced("div", {
                classes: ["StoneUIElement"],
            });
            this.update();
            this.addEventListeners();
        }
        static #elements = new Map();
        static getUIElement(_obj) {
            if (!this.#elements.has(_obj)) {
                this.#elements.set(_obj, new StoneUIElement(_obj));
            }
            return this.#elements.get(_obj);
        }
        get element() {
            return this.#element;
        }
        get stone() {
            return this.#stone;
        }
        addEventListeners() {
            // TODO: when to remove these listeners?
            Script.EventBus.addEventListener(Script.EVENT.TRIGGER_ABILITY, this.animate);
        }
    }
    Script.StoneUIElement = StoneUIElement;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map