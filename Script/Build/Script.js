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
        EVENT["SHOW_PREVIEW"] = "showPreview";
        EVENT["HIDE_PREVIEW"] = "hidePreview";
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
        static dispatchEventWithoutWaiting(_ev) {
            if (!this.listeners.has(_ev.type))
                return [];
            const listeners = [...this.listeners.get(_ev.type)]; // copying this so removing listeners doesn't skip any
            const promises = [];
            for (let listener of listeners) {
                try {
                    promises.push(new Promise(async (resolve) => { await listener(_ev); resolve(); }));
                }
                catch (error) {
                    console.error(error);
                }
            }
            return promises;
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
    //iterates through the grid and executes every entities move
    async function move(_grid) {
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
    // returns the new direction, the entity will move in
    function getNextDirection(_rotateBy, _direction) {
        let directions = [
            [1, 0], // North
            [1, 1], // North-West
            [0, 1], // West
            [-1, 1], // South-West
            [-1, 0], // South
            [-1, -1], // South-East
            [0, -1], // East
            [1, -1] // North-East
        ];
        let i = directions.findIndex(dir => dir[0] === _direction[0] && dir[1] === _direction[1]);
        //get the index for the next rotation
        let selector = (i + _rotateBy) % 8;
        //get the direction from the array
        let dir = directions[selector];
        return dir;
    }
    Script.getNextDirection = getNextDirection;
    // returns the next position based on the current position, the entities rotation and the step size
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
            return { targets: [] };
        const targets = [];
        const side = _target.side === TARGET_SIDE.ALLY ? _allies : _opponents;
        // entity selector
        if ("entity" in _target) {
            side.forEachElement((entity) => {
                if (!entity)
                    return;
                if (entity.untargetable)
                    return;
                if (_target.excludeSelf && entity === _self)
                    return;
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
            return { targets, side: _target.side };
        }
        // area selector
        else if ("area" in _target) {
            const pattern = getTargetPositions(_target, _self, side);
            // get the actual entities in these areas now
            side.forEachElement((el, pos) => {
                if (el.untargetable)
                    return;
                if (pattern.get(pos))
                    targets.push(el);
            });
            return { targets, side: _target.side, positions: pattern };
        }
        return { targets };
    }
    Script.getTargets = getTargets;
    function getTargetPositions(_target, _self, _side) {
        let pattern = new Script.Grid();
        let pos;
        if (_target.area.position !== AREA_POSITION_ABSOLUTE.ABSOLUTE && !_self)
            return pattern;
        switch (_target.area.position) {
            case Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW: {
                for (let i = 0; i < 3; i++) {
                    const entity = _side.get([i, _self.position[1]]);
                    if (entity && !entity.untargetable) {
                        pos = [i, _self.position[1]];
                        break;
                    }
                }
                break;
            }
            case Script.AREA_POSITION.RELATIVE_LAST_IN_ROW: {
                for (let i = 2; i >= 0; i--) {
                    const entity = _side.get([i, _self.position[1]]);
                    if (entity && !entity.untargetable) {
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
            return pattern;
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
        return pattern;
    }
    Script.getTargetPositions = getTargetPositions;
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
                id: "defaultEumling",
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
                },
                info: "Attacks the first opponent in the opposite column for 1 damage."
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
                },
                info: "Attacks the opposite column, row or in a cross for 1 damage. Picks one at random each new fight."
            },
            {
                id: "RI-Eumling",
                health: 4,
                attacks: {
                    baseDamage: 1,
                    baseCritChance: 50,
                    target: {
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW,
                            shape: Script.AREA_SHAPE.SINGLE
                        },
                    },
                },
                info: "Attacks the first opponent in the opposite column for 1 damage. Has a 50% crit-chance."
            },
            {
                id: "RAC-Eumling",
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
                        amount: 2,
                    }
                },
                info: "Attacks the opposite column, row or in a cross for 1 damage. Picks two at random each new fight."
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
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_ATTACK,
                        target: "target",
                        conditions: {
                            cause: Script.TARGET.SELF
                        },
                        spell: {
                            type: Script.SPELL_TYPE.GOLD,
                            level: 1,
                        }
                    }
                ],
                info: "Attacks the opposite column, row or in a cross for 1 damage. Picks one at random each new fight. Gains 1 gold on each attack."
            },
            {
                id: "RIC-Eumling",
                health: 5,
                attacks: {
                    baseDamage: 1,
                    baseCritChance: 75,
                    target: {
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_MIRRORED,
                            shape: Script.AREA_SHAPE.ROW,
                        },
                    }
                },
                info: "Attacks the entire opposite column for 1 damage. Has a 75% crit-chance."
            },
            {
                id: "RIE-Eumling",
                health: 5,
                attacks: {
                    baseDamage: 2,
                    baseCritChance: 50,
                    target: {
                        side: Script.TARGET_SIDE.OPPONENT,
                        area: {
                            position: Script.AREA_POSITION.RELATIVE_FIRST_IN_ROW,
                            shape: Script.AREA_SHAPE.SINGLE,
                        },
                    }
                },
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_ATTACK,
                        target: "target",
                        conditions: {
                            cause: Script.TARGET.SELF
                        },
                        spell: {
                            type: Script.SPELL_TYPE.GOLD,
                            level: 2,
                        }
                    }
                ],
                info: "Attacks the first opponent in the opposite column for 2 damage. Has a 50% crit-chance. Gains 2 gold on each attack."
            },
            {
                id: "S-Eumling",
                health: 4,
                spells: {
                    target: Script.TARGET.SELF,
                    type: Script.SPELL_TYPE.HEAL,
                    level: 1,
                },
                info: "Heals itself for 1 health every round."
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
                    }],
                info: "Selects three random fields every combat and heals them for 1 health every round. Gives healed allies 1 shield."
            },
            {
                id: "SI-Eumling",
                health: 5,
                spells: {
                    target: Script.TARGET.RANDOM_ALLY,
                    type: Script.SPELL_TYPE.HEAL,
                    level: 2,
                },
                info: "Heals a random ally for 2 health every round."
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
                    }],
                info: "Selects three random fields every combat and heals them for 1 health every round. Gives healed allies 2 shield."
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
                        amount: 5,
                    }
                },
                abilities: [{
                        on: Script.EVENT.ENTITY_HEALED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                            }],
                        target: "target",
                        spell: {
                            type: Script.SPELL_TYPE.GOLD,
                            level: 1,
                        }
                    }],
                info: "Selects five random fields every combat and heals them for 1 health every round. Gains 1 gold when healing allies."
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
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
                            level: 2,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_FIGHT,
                        amount: 4,
                    }
                },
                info: "Selects four random fields every combat and heals them for 2 health every round."
            },
            {
                id: "SIE-Eumling", // TODO: +1 Gold per heart that is healed
                health: 6,
                spells: {
                    target: Script.TARGET.RANDOM_ALLY,
                    type: Script.SPELL_TYPE.HEAL,
                    level: 3,
                },
                abilities: [{
                        on: Script.EVENT.ENTITY_HEALED,
                        conditions: [{
                                target: { side: Script.TARGET_SIDE.ALLY, entity: {}, excludeSelf: false }
                            }],
                        target: "target",
                        spell: {
                            type: Script.SPELL_TYPE.GOLD,
                            level: 1,
                        }
                    }],
                info: "Heals a random ally for 3 health every round. Gains 1 gold when healing allies."
            },
            {
                id: "cactusCrawler", // doesn't attack but gets thorns after moving
                health: 1,
                moves: { direction: Script.DIRECTION_RELATIVE.FORWARD, currentDirection: [1, 0], distance: 1, blocked: { attempts: 8, rotateBy: 4 } },
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
                ],
                info: "Moves up and down, gains 1 Thorns after moving."
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
                },
                info: "Attacks the opposite field for 2 damage."
            },
            {
                id: "idioticIcicle", // enemy that attacks the entire mirrored row for 1
                health: 2,
                attacks: {
                    options: [
                        {
                            target: {
                                area: {
                                    shape: Script.AREA_SHAPE.ROW,
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
                info: "Attacks the entire opposite row for 1 damage."
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
                },
                info: "Attacks all opposite fields except for the center for 1 damage."
            },
            {
                id: "sandSitter", // enemy that attacks a plus, but spawns in round 2 (not implemented yet)
                health: 1,
                abilities: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: Script.TARGET.SELF,
                        spell: {
                            type: Script.SPELL_TYPE.STUN,
                        }
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: Script.TARGET.SELF,
                        spell: {
                            type: Script.SPELL_TYPE.UNTARGETABLE,
                        }
                    }
                ],
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
                },
                info: "Appears after the first round and attacks in a plus pattern for 1 damage."
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
                            baseDamage: 20,
                        }
                    },
                ],
                info: "Doesn't attack and disappears when another enemy is defeated."
            },
            {
                id: "countdownCoconut", // coconut that blows up on the final turn
                health: 2,
                abilities: [
                    {
                        on: Script.EVENT.FIGHT_END,
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
                        },
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: Script.TARGET.SELF,
                        attack: {
                            baseDamage: 10,
                        }
                    },
                ],
                info: "Blows itself up at the end of the fight, dealing 2 damage on all opposite fields."
            },
            {
                id: "floppyFish", // attacks random position and then moves randomly TODO
                health: 1,
                attacks: {
                    options: [
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 0],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 1],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [0, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [1, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                        {
                            target: {
                                side: Script.TARGET_SIDE.OPPONENT,
                                area: {
                                    position: Script.AREA_POSITION.ABSOLUTE,
                                    absolutePosition: [2, 2],
                                    shape: Script.AREA_SHAPE.SINGLE,
                                },
                            },
                            baseDamage: 1,
                        },
                    ],
                    selection: {
                        order: Script.SELECTION_ORDER.RANDOM_EACH_ROUND,
                        amount: 1,
                    }
                },
                info: "Attacks a random opposite field for 1 damage each round."
            },
            {
                id: "okayOyster", // shields others upon taking damage
                health: 3,
                abilities: [
                    {
                        on: Script.EVENT.ENTITY_HURT,
                        conditions: [{
                                target: Script.TARGET.SELF,
                            }],
                        target: Script.TARGET.RANDOM_ALLY,
                        spell: {
                            type: Script.SPELL_TYPE.SHIELD,
                            level: 1,
                        }
                    },
                ],
                info: "Doesn't attack but gives other enemies 1 shield upon taking damage."
            },
            {
                id: "Björn", // Björn's entity for testing
                health: 100000000,
                info: "This is Björn. Björn has a lot of health."
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
                    ["defaultEumling", , ,],
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
                    ["idioticIcicle", , ,],
                    [, "idioticIcicle", ,],
                    [, , "idioticIcicle",]
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
                    [, "sandSitter", "idioticIcicle",],
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
                    ["idioticIcicle", , "flameFlinger",]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, "punchingPalmtree", ,],
                    ["idioticIcicle", , ,],
                    [, "punchingPalmtree", ,]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, , "floppyFish",],
                    ["floppyFish", , ,],
                    [, "floppyFish", ,]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, "floppyFish", ,],
                    [, , "idioticIcicle",],
                    ["floppyFish", , ,]
                ],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    ["floppyFish", "punchingPalmtree", ,],
                    [, , ,],
                    [, , "floppyFish",]
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
                difficulty: 1,
                rounds: 3,
                entities: [
                    [, "floppyFish", "floppyFish",],
                    [, "floppyFish", "floppyFish",],
                    [, "floppyFish", "floppyFish",]
                ],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    [, , ,],
                    [, , ,],
                    ["okayOyster", , "countdownCoconut",]
                ],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    [, "okayOyster", "sandSitter",],
                    [, , ,],
                    [, "okayOyster", "punchingPalmtree",]
                ],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["worriedWall", "idioticIcicle", "sandSitter",],
                    ["worriedWall", "cactusCrawler", "countdownCoconut",],
                    [, , ,]
                ],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["idioticIcicle", , "flameFlinger",],
                    ["cactusCrawler", "sandSitter", ,],
                    ["flameFlinger", , "idioticIcicle",]
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
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["floppyFish", "punchingPalmtree", "flameFlinger",],
                    ["floppyFish", , "idioticIcicle",],
                    ["floppyFish", "sandSitter", "flameFlinger",]
                ],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["okayOyster", "worriedWall", "countdownCoconut",],
                    ["okayOyster", "worriedWall", ,],
                    ["okayOyster", "worriedWall", "countdownCoconut",]
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
            this.registerEntityListeners = () => {
                this.arena.away.forEachElement(el => el.registerEventListeners());
                this.arena.home.forEachElement(el => el.registerEventListeners());
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
            // moves
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
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_PREPARE_COMPLETED, this.registerEntityListeners);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_DIED, this.handleDeadEntity);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_ADDED, this.handleEntityChange);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_REMOVED, this.handleEntityChange);
            Script.EventBus.removeEventListener(Script.EVENT.FIGHT_PREPARE_COMPLETED, this.registerEntityListeners);
        }
    }
    Script.Fight = Fight;
})(Script || (Script = {}));
var Script;
(function (Script) {
    // This whole VFX effect thing is convoluted and I'm unhappy with how it turned out.
    // All those nested promises and shit... we should probably rewrite that at some point.
    // But for now it seems to be doing its job decently.
    class VisualizeTarget {
        constructor() {
            this.nodePool = new Map();
            this.visibleNodes = [];
            this.showAttack = async (_ev) => {
                const nodes = this.getTargets(_ev);
                const promises = [];
                for (let node of nodes) {
                    promises.push(this.addNodesTo(node, this.getAdditionalVisualizer(_ev.cause, _ev.type)));
                }
                return Promise.all(promises);
            };
            this.showPreview = async (_ev) => {
                const nodes = this.getTargets(_ev);
                for (let node of nodes) {
                    this.addNodesTo(node);
                }
            };
            this.hideTargets = async (_ev) => {
                while (this.visibleNodes.length > 0) {
                    this.returnNode(this.visibleNodes.pop());
                }
            };
            this.addEventListeners();
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_ATTACK, this.showAttack);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_ATTACKED, this.hideTargets);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_SPELL_BEFORE, this.showAttack);
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_SPELL, this.hideTargets);
            Script.EventBus.addEventListener(Script.EVENT.SHOW_PREVIEW, this.showPreview);
            Script.EventBus.addEventListener(Script.EVENT.HIDE_PREVIEW, this.hideTargets);
        }
        getTargets(_ev) {
            if (!_ev.detail)
                return [];
            const targets = [];
            positions: if (_ev.detail.positions) {
                if (!_ev.trigger || !("target" in _ev.trigger))
                    break positions;
                if (typeof _ev.trigger.target === "string")
                    break positions;
                const vis = Script.Provider.visualizer;
                let allySide, opponentSide;
                if (_ev.cause instanceof Script.Stone) {
                    allySide = vis.activeFight.home;
                    opponentSide = vis.activeFight.away;
                }
                else {
                    const visGrid = vis.activeFight.whereIsEntity(vis.getEntity(_ev.cause));
                    if (visGrid.side === "home") {
                        allySide = vis.activeFight.home;
                        opponentSide = vis.activeFight.away;
                    }
                    else {
                        allySide = vis.activeFight.away;
                        opponentSide = vis.activeFight.home;
                    }
                }
                const targetSide = _ev.trigger.target.side === Script.TARGET_SIDE.ALLY ? allySide : opponentSide;
                _ev.detail.positions.forEachElement(async (_el, _pos) => {
                    const anchor = targetSide.getAnchor(_pos[0], _pos[1]);
                    targets.push(anchor);
                });
                return targets;
            }
            if (!_ev.detail.targets)
                return [];
            for (let target of _ev.detail.targets) {
                targets.push(Script.Provider.visualizer.getEntity(target));
            }
            return targets;
        }
        async addNodesTo(_parent, ..._nodes) {
            const promises = [];
            for (let node of _nodes) {
                if (!node)
                    continue;
                promises.push((await this.getVFX(node)).addToAndActivate(_parent));
            }
            promises.push((await this.getVFX("TargetHighlightGeneric")).addToAndActivate(_parent));
            return Promise.all(promises);
        }
        async getVFX(_v) {
            let vfx;
            const id = typeof _v === "string" ? _v : _v.id;
            const delay = typeof _v === "string" ? 0 : _v.delay;
            if (this.nodePool.get(id)?.length > 0)
                vfx = this.nodePool.get(id).pop();
            else
                vfx = new Script.VisualizeVFX(await Script.DataLink.getCopyOf(id), id, delay);
            this.visibleNodes.push(vfx);
            return vfx;
        }
        getAdditionalVisualizer(_cause, _evtype) {
            if (_cause instanceof Script.Stone) {
                // TODO: add something so stones can define visuals, too.
                return undefined;
            }
            const id = _cause.id;
            if (!id)
                return undefined;
            return Script.VisualizationLink.linkedVisuals.get(id)?.get(_evtype === Script.EVENT.ENTITY_ATTACK ? Script.ANIMATION.ATTACK : Script.ANIMATION.SPELL);
        }
        returnNode(_node) {
            _node.removeAndDeactivate();
            if (!this.nodePool.has(_node.id))
                this.nodePool.set(_node.id, []);
            this.nodePool.get(_node.id).push(_node);
        }
    }
    Script.VisualizeTarget = VisualizeTarget;
})(Script || (Script = {}));
/// <reference path="Entities/VisualizeTarget.ts" />
var Script;
/// <reference path="Entities/VisualizeTarget.ts" />
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
                let fightVis = this.getFight(fight);
                this.activeFight = fightVis;
            };
            this.root = new ƒ.Node("Root");
            new Script.VisualizeTarget();
            this.getGUI();
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
            Script.setupSounds(this.camera.node);
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
        async onAdd(_zindex, _ev) {
            this.element.classList.remove("hidden");
            this.element.style.zIndex = _zindex.toString();
            this.addEventListeners();
        }
        async onShow() {
            this.element.classList.remove("hidden");
        }
        async onHide() {
            // this.element.classList.add("hidden"); // TODO should it really get hidden? or just disabled?
        }
        async onRemove() {
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
    class StartScreenUI extends Script.UILayer {
        constructor() {
            super();
            this.parallax = (_ev) => {
                this.element.style.setProperty("--x", (_ev.clientX / window.innerWidth).toString());
                this.element.style.setProperty("--y", (_ev.clientY / window.innerHeight).toString());
            };
            this.element = document.getElementById("StartScreen");
        }
        addEventListeners() {
            document.addEventListener("mousemove", this.parallax);
        }
        removeEventListeners() {
            document.removeEventListener("mousemove", this.parallax);
        }
    }
    Script.StartScreenUI = StartScreenUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class LoadingScreenUI extends Script.UILayer {
        constructor() {
            super();
            this.element = document.getElementById("LoadingScreen");
        }
        startLoad() {
        }
        addEventListeners() {
            this.element.addEventListener("click", this.startLoad);
        }
        removeEventListeners() {
            this.element.removeEventListener("click", this.startLoad);
        }
    }
    Script.LoadingScreenUI = LoadingScreenUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class MainMenuUI extends Script.UILayer {
        constructor() {
            super();
            this.start = () => {
                Script.run();
                Script.Provider.GUI.removeTopmostUI();
            };
            this.openOptions = () => {
                Script.Provider.GUI.addUI("options");
            };
            this.element = document.getElementById("MainMenu");
            this.startButton = document.getElementById("MainStart");
            this.optionsButton = document.getElementById("MainOptions");
        }
        addEventListeners() {
            this.startButton.addEventListener("click", this.start);
            this.optionsButton.addEventListener("click", this.openOptions);
        }
        removeEventListeners() {
            this.startButton.removeEventListener("click", this.start);
            this.optionsButton.removeEventListener("click", this.openOptions);
        }
    }
    Script.MainMenuUI = MainMenuUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class OptionsUI extends Script.UILayer {
        constructor() {
            super();
            this.close = () => {
                Script.Provider.GUI.removeTopmostUI();
            };
            this.element = document.getElementById("Options");
            this.closeButton = document.getElementById("OptionsClose");
        }
        async onAdd(_zindex, _ev) {
            await super.onAdd(_zindex, _ev);
            document.getElementById("OptionsWrapper").replaceChildren(Script.Settings.generateHTML());
        }
        addEventListeners() {
            this.closeButton.addEventListener("click", this.close);
        }
        removeEventListeners() {
            this.closeButton.removeEventListener("click", this.close);
        }
    }
    Script.OptionsUI = OptionsUI;
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
                this.confirmButton.classList.remove("hidden");
                this.infoElement.innerHTML = `
            <span class="InfoTitle">${eumling.type}</span>
            <span class="Info">${eumling.health}♥️</span>
            <span class="Info">${eumling.info}</span>`;
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
            this.infoElement = document.getElementById("ChooseEumlingInfo");
            this.confirmButton = document.getElementById("ChooseEumlingConfirm");
        }
        async onAdd(_zindex) {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;
            this.confirmButton.classList.add("hidden");
            const optionElement = document.getElementById("ChooseEumlingOptions");
            const options = ["R", "S"];
            this.optionElements.clear();
            for (let opt of options) {
                let eumling = new Script.Eumling(opt);
                let uiElement = Script.createElementAdvanced("div", { classes: ["clickable", "selectable"] });
                uiElement.addEventListener("click", this.clickedEumling);
                this.optionElements.set(uiElement, eumling);
                optionElement.appendChild(uiElement);
                uiElement.appendChild(Script.EumlingUIElement.getUIElement(eumling).element);
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
                this.confirmButton.classList.remove("hidden");
                this.infoElement.innerHTML = `
            <span class="InfoTitle">${stone.id}</span>
            <span class="InfoSmaller">Level ${stone.level + 1}</span>
            <span class="Info">${stone.data.abilityLevels[stone.level].info}</span>`;
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
            this.infoElement = document.getElementById("ChooseStoneInfo");
            this.confirmButton = document.getElementById("ChooseStoneConfirm");
        }
        async onAdd(_zindex) {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;
            this.confirmButton.classList.add("hidden");
            const optionElement = document.getElementById("ChooseStoneOptions");
            this.optionElements.clear();
            const options = Script.chooseRandomElementsFromArray(Script.Provider.data.stones, 3);
            for (let opt of options) {
                let stone = new Script.Stone(opt);
                let uiElement = Script.createElementAdvanced("div", { classes: ["clickable", "selectable"] });
                uiElement.addEventListener("click", this.clickedStone);
                this.optionElements.set(uiElement, stone);
                optionElement.appendChild(uiElement);
                uiElement.appendChild(Script.StoneUIElement.getUIElement(stone).element);
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
            this.click = (_ev) => {
                if (this.optionElements.includes(_ev.target))
                    return;
                if (_ev.target === this.submitBtn)
                    return;
                this.submitBtn.disabled = true;
                this.submitBtn.classList.add("hidden");
                this.hill.dataset.selected = "";
                for (let opt of this.optionElements) {
                    opt.classList.remove("selected");
                }
                this.selectedEncounter = undefined;
            };
            this.openOptions = (_ev) => {
                Script.Provider.GUI.addUI("options");
            };
            this.element = document.getElementById("Map");
            this.submitBtn = document.getElementById("MapActionButton");
            this.optionButton = document.getElementById("MapOptionButton");
            this.hill = document.getElementById("MapHill");
        }
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex);
            this.updateProgress();
            this.displayEncounters(_ev);
            this.element.classList.remove("no-interact");
            this.hill.dataset.selected = "";
            this.submitBtn.classList.add("hidden");
            document.getElementById("MapHeader").appendChild(Script.GoldDisplayElement.element);
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
                elem.dataset.type = option.toString();
                elem.addEventListener("click", () => {
                    for (let opt of this.optionElements) {
                        opt.classList.remove("selected");
                    }
                    elem.classList.add("selected");
                    this.selectedEncounter = option;
                    this.submitBtn.disabled = false;
                    this.submitBtn.classList.remove("hidden");
                    this.hill.dataset.selected = this.optionElements.indexOf(elem).toString();
                    if (option < 0) {
                        // shop
                        this.submitBtn.innerText = "Shop";
                    }
                    else {
                        this.submitBtn.innerText = "Battle";
                    }
                });
                this.optionElements.push(elem);
            }
            document.getElementById("MapOptions").replaceChildren(...this.optionElements);
            this.submitBtn.disabled = true;
        }
        addEventListeners() {
            this.submitBtn.addEventListener("click", this.selectionDone);
            this.optionButton.addEventListener("click", this.openOptions);
            document.getElementById("Map").addEventListener("click", this.click);
        }
        removeEventListeners() {
            this.submitBtn.removeEventListener("click", this.selectionDone);
            this.optionButton.removeEventListener("click", this.openOptions);
            document.getElementById("Map").removeEventListener("click", this.click);
        }
    }
    Script.MapUI = MapUI;
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
            static async getCopyOf(_id) {
                let original = this.linkedNodes.get(_id);
                if (!original)
                    return undefined;
                return Script.getDuplicateOfNode(original);
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
        let _audio1_decorators;
        let _audio1_initializers = [];
        let _audio1_extraInitializers = [];
        let _audio2_decorators;
        let _audio2_initializers = [];
        let _audio2_extraInitializers = [];
        let _audio3_decorators;
        let _audio3_initializers = [];
        let _audio3_extraInitializers = [];
        let _audio4_decorators;
        let _audio4_initializers = [];
        let _audio4_extraInitializers = [];
        let _animType_decorators;
        let _animType_initializers = [];
        let _animType_extraInitializers = [];
        var AnimationLink = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _animation_decorators = [ƒ.serialize(ƒ.Animation)];
                _audio1_decorators = [ƒ.serialize(ƒ.Audio)];
                _audio2_decorators = [ƒ.serialize(ƒ.Audio)];
                _audio3_decorators = [ƒ.serialize(ƒ.Audio)];
                _audio4_decorators = [ƒ.serialize(ƒ.Audio)];
                _animType_decorators = [ƒ.serialize(ANIMATION)];
                __esDecorate(null, null, _animation_decorators, { kind: "field", name: "animation", static: false, private: false, access: { has: obj => "animation" in obj, get: obj => obj.animation, set: (obj, value) => { obj.animation = value; } }, metadata: _metadata }, _animation_initializers, _animation_extraInitializers);
                __esDecorate(null, null, _audio1_decorators, { kind: "field", name: "audio1", static: false, private: false, access: { has: obj => "audio1" in obj, get: obj => obj.audio1, set: (obj, value) => { obj.audio1 = value; } }, metadata: _metadata }, _audio1_initializers, _audio1_extraInitializers);
                __esDecorate(null, null, _audio2_decorators, { kind: "field", name: "audio2", static: false, private: false, access: { has: obj => "audio2" in obj, get: obj => obj.audio2, set: (obj, value) => { obj.audio2 = value; } }, metadata: _metadata }, _audio2_initializers, _audio2_extraInitializers);
                __esDecorate(null, null, _audio3_decorators, { kind: "field", name: "audio3", static: false, private: false, access: { has: obj => "audio3" in obj, get: obj => obj.audio3, set: (obj, value) => { obj.audio3 = value; } }, metadata: _metadata }, _audio3_initializers, _audio3_extraInitializers);
                __esDecorate(null, null, _audio4_decorators, { kind: "field", name: "audio4", static: false, private: false, access: { has: obj => "audio4" in obj, get: obj => obj.audio4, set: (obj, value) => { obj.audio4 = value; } }, metadata: _metadata }, _audio4_initializers, _audio4_extraInitializers);
                __esDecorate(null, null, _animType_decorators, { kind: "field", name: "animType", static: false, private: false, access: { has: obj => "animType" in obj, get: obj => obj.animType, set: (obj, value) => { obj.animType = value; } }, metadata: _metadata }, _animType_initializers, _animType_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                AnimationLink = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.linkedAnimations = new Map(); }
            static { this.linkedAudio = new Map(); }
            constructor() {
                super();
                this.singleton = false;
                this.animation = __runInitializers(this, _animation_initializers, void 0);
                this.audio1 = (__runInitializers(this, _animation_extraInitializers), __runInitializers(this, _audio1_initializers, void 0));
                this.audio2 = (__runInitializers(this, _audio1_extraInitializers), __runInitializers(this, _audio2_initializers, void 0));
                this.audio3 = (__runInitializers(this, _audio2_extraInitializers), __runInitializers(this, _audio3_initializers, void 0));
                this.audio4 = (__runInitializers(this, _audio3_extraInitializers), __runInitializers(this, _audio4_initializers, void 0));
                this.animType = (__runInitializers(this, _audio4_extraInitializers), __runInitializers(this, _animType_initializers, void 0));
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
                            AnimationLink.linkedAudio.set(link.id, new Map());
                        }
                        AnimationLink.linkedAnimations.get(link.id).set(this.animType, this.animation);
                        AnimationLink.linkedAudio.get(link.id).set(this.animType, []);
                        if (this.audio1)
                            AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio1);
                        if (this.audio2)
                            AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio2);
                        if (this.audio3)
                            AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio3);
                        if (this.audio4)
                            AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio4);
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
    let VisualizationLink = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.Component;
        let _visualization_decorators;
        let _visualization_initializers = [];
        let _visualization_extraInitializers = [];
        let _for_decorators;
        let _for_initializers = [];
        let _for_extraInitializers = [];
        let _delay_decorators;
        let _delay_initializers = [];
        let _delay_extraInitializers = [];
        var VisualizationLink = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _visualization_decorators = [ƒ.serialize(String)];
                _for_decorators = [ƒ.serialize(ANIMATION)];
                _delay_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, _visualization_decorators, { kind: "field", name: "visualization", static: false, private: false, access: { has: obj => "visualization" in obj, get: obj => obj.visualization, set: (obj, value) => { obj.visualization = value; } }, metadata: _metadata }, _visualization_initializers, _visualization_extraInitializers);
                __esDecorate(null, null, _for_decorators, { kind: "field", name: "for", static: false, private: false, access: { has: obj => "for" in obj, get: obj => obj.for, set: (obj, value) => { obj.for = value; } }, metadata: _metadata }, _for_initializers, _for_extraInitializers);
                __esDecorate(null, null, _delay_decorators, { kind: "field", name: "delay", static: false, private: false, access: { has: obj => "delay" in obj, get: obj => obj.delay, set: (obj, value) => { obj.delay = value; } }, metadata: _metadata }, _delay_initializers, _delay_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                VisualizationLink = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.linkedVisuals = new Map(); }
            get id() {
                return this.visualization;
            }
            constructor() {
                super();
                this.singleton = false;
                this.visualization = __runInitializers(this, _visualization_initializers, void 0);
                // TODO: this is hacky, use its own thing for it to properly map it to the actual events
                this.for = (__runInitializers(this, _visualization_extraInitializers), __runInitializers(this, _for_initializers, void 0));
                this.delay = (__runInitializers(this, _for_extraInitializers), __runInitializers(this, _delay_initializers, void 0));
                __runInitializers(this, _delay_extraInitializers);
                if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                    return;
                ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, () => {
                    if (this.node instanceof ƒ.Graph) {
                        let link = this.node.getComponent(DataLink);
                        if (!link)
                            return;
                        if (!VisualizationLink.linkedVisuals.has(link.id)) {
                            VisualizationLink.linkedVisuals.set(link.id, new Map());
                        }
                        VisualizationLink.linkedVisuals.get(link.id).set(this.for, this);
                    }
                });
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return VisualizationLink = _classThis;
    })();
    Script.VisualizationLink = VisualizationLink;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
/// <reference path="../../Data/DataLink.ts" />
var Script;
/// <reference path="UILayer.ts" />
/// <reference path="../../Data/DataLink.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    class FightPrepUI extends Script.UILayer {
        constructor() {
            super();
            this.placedEumlings = new Set();
            this.startFight = (_ev) => {
                Script.EventBus.dispatchEventWithoutWaiting({ type: Script.EVENT.FIGHT_PREPARE_COMPLETED });
            };
            this.pointerStartPosition = new ƒ.Vector2();
            this.deadzone = 20;
            this.pointerOnCanvas = (_ev) => {
                if (_ev.type === "pointerdown") {
                    this.pointerStartPosition.x = _ev.clientX;
                    this.pointerStartPosition.y = _ev.clientY;
                }
                else if (_ev.type === "pointerup") {
                    const pointerEndPosition = new ƒ.Vector2(_ev.clientX, _ev.clientY);
                    const distance = pointerEndPosition.getDistance(this.pointerStartPosition);
                    if (distance > this.deadzone) {
                        // drag
                        this.dragCanvas(this.pointerStartPosition, pointerEndPosition);
                    }
                    else {
                        // click
                        this.clickCanvas(pointerEndPosition);
                    }
                }
            };
            this.element = document.getElementById("FightPrep");
            this.stoneWrapper = document.getElementById("FightPrepStones");
            this.infoElement = document.getElementById("FightPrepInfo");
            this.startButton = document.getElementById("FightStart");
            Script.DataLink.getCopyOf("PreviewHighlight").then(node => this.highlightNode = node);
        }
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.startButton.disabled = true;
            this.startButton.classList.add("hidden");
            this.initStones();
            this.initEumlings();
            this.placedEumlings.clear();
            await this.moveCamera(ƒ.Vector3.Z(-3), ƒ.Vector3.X(10), 1000);
            const center = Script.viewport.pointWorldToClient(ƒ.Vector3.Z(-0.3));
            document.getElementById("FightPrepInfoWrapper").style.top = center.y + "px";
            document.getElementById("FightPrepGoldCounterWrapper").appendChild(Script.GoldDisplayElement.element);
        }
        async onRemove() {
            super.onRemove();
            this.hideEntityInfo();
            await this.moveCamera(ƒ.Vector3.Z(3), ƒ.Vector3.X(-10), 1000);
        }
        initStones() {
            const stones = [];
            for (let stone of Script.Run.currentRun.stones) {
                const element = Script.createElementAdvanced("div", { classes: ["clickable"] });
                stones.push(element);
                element.appendChild(Script.StoneUIElement.getUIElement(stone).element);
                element.addEventListener("click", () => {
                    this.hideEntityInfo();
                    this.infoElement.innerHTML = `
                    <span class="InfoTitle">${stone.id}</span>
                    <span class="InfoSmaller">Level ${stone.level + 1}</span>
                    <span class="Info">${stone.data.abilityLevels[stone.level].info}</span>`;
                    this.infoElement.classList.remove("hidden");
                });
            }
            this.stoneWrapper.replaceChildren(...stones);
        }
        initEumlings() {
            const bench = Script.viewport.getBranch().getChildByName("Bench")?.getComponent(Script.VisualizeBench);
            this.bench = bench;
            if (!bench)
                return;
            bench.clear();
            for (let eumling of Script.Run.currentRun.eumlings) {
                bench.addEntity(Script.Provider.visualizer.getEntity(eumling));
            }
        }
        returnEumling(_eumling) {
            // remove from field
            Script.EventBus.dispatchEventWithoutWaiting({ type: Script.EVENT.ENTITY_REMOVED, target: _eumling });
            // add to bench
            const vis = Script.Provider.visualizer.getEntity(_eumling);
            this.bench?.addEntity(vis);
            this.placedEumlings.delete(_eumling);
            // can we start?
            if (this.placedEumlings.size <= 0) {
                this.startButton.disabled = true;
                this.startButton.classList.add("hidden");
            }
            // update visuals
            if (vis === this.#highlightedEntity) {
                this.showEntityInfo(vis);
            }
        }
        moveEumlingToGrid(_eumling, _target) {
            const posId = parseInt(_target.name);
            const vis = Script.Provider.visualizer.getEntity(_eumling);
            this.bench?.removeEntity(vis);
            Script.EventBus.dispatchEventWithoutWaiting({ type: Script.EVENT.ENTITY_ADDED, target: _eumling, detail: { side: "home", pos: [posId % 3, Math.floor(posId / 3)] } });
            this.placedEumlings.add(_eumling);
            this.startButton.disabled = false;
            this.startButton.classList.remove("hidden");
            // update visuals
            if (vis === this.#highlightedEntity) {
                this.showEntityInfo(vis);
            }
        }
        clickCanvas(_pos) {
            this.hideEntityInfo();
            const picks = Script.getPickableObjectsFromClientPos(_pos);
            if (!picks || picks.length === 0)
                return;
            for (const pick of picks) {
                if (!(pick.node instanceof Script.VisualizeEntity)) {
                    continue;
                }
                this.showEntityInfo(pick.node);
                break;
            }
        }
        dragCanvas(_startPos, _endPos) {
            // find which Eumling should be moved
            const picksStart = Script.getPickableObjectsFromClientPos(_startPos);
            if (!picksStart || picksStart.length === 0)
                return;
            let draggedEumling;
            for (let pick of picksStart) {
                if (!(pick.node instanceof Script.VisualizeEntity))
                    continue;
                if (!(pick.node.getEntity() instanceof Script.Eumling))
                    continue;
                draggedEumling = pick.node.getEntity();
                break;
            }
            if (!draggedEumling)
                return;
            // find where to move it to
            const picksEnd = Script.getPickableObjectsFromClientPos(_endPos);
            if (!picksEnd || picksEnd.length === 0) {
                // nowhere = back to the bench
                return this.returnEumling(draggedEumling);
            }
            for (const pick of picksEnd) {
                // one of the home fields
                const num = Number(pick.node.name);
                if (!isNaN(num)) {
                    return this.moveEumlingToGrid(draggedEumling, pick.node);
                }
            }
        }
        #highlightedEntity;
        showEntityInfo(_entity) {
            this.hideEntityInfo();
            const entity = _entity.getEntity();
            this.infoElement.classList.remove("hidden");
            this.infoElement.innerHTML = `
                <span class="InfoTitle">${entity.id}</span>
                <span class="InfoSmaller">${entity.currentHealth} / ${entity.health}♥️</span>
                <span class="Info">${entity.info}</span>`;
            if (this.highlightNode && !this.bench.hasEntity(_entity)) {
                _entity.addChild(this.highlightNode);
                this.highlightNode.mtxLocal.translation = ƒ.Vector3.ZERO();
            }
            this.#highlightedEntity = _entity;
            const attacks = entity.select(entity.attacks, false);
            for (let attack of attacks) {
                const allies = entity instanceof Script.Eumling ? Script.Fight.activeFight.arena.home : Script.Fight.activeFight.arena.away;
                const opponents = entity instanceof Script.Eumling ? Script.Fight.activeFight.arena.away : Script.Fight.activeFight.arena.home;
                const detail = Script.getTargets(attack.target, allies, opponents, entity);
                Script.EventBus.dispatchEventWithoutWaiting({ type: Script.EVENT.SHOW_PREVIEW, cause: entity, target: entity, trigger: attack, detail });
            }
        }
        hideEntityInfo() {
            this.infoElement.classList.add("hidden");
            this.highlightNode?.getParent()?.removeChild(this.highlightNode);
            Script.EventBus.dispatchEventWithoutWaiting({ type: Script.EVENT.HIDE_PREVIEW });
            this.#highlightedEntity = undefined;
        }
        addEventListeners() {
            const canvas = document.getElementById("GameCanvas");
            canvas.addEventListener("pointerdown", this.pointerOnCanvas);
            canvas.addEventListener("pointerup", this.pointerOnCanvas);
            this.startButton.addEventListener("click", this.startFight);
        }
        removeEventListeners() {
            const canvas = document.getElementById("GameCanvas");
            canvas.removeEventListener("pointerdown", this.pointerOnCanvas);
            canvas.removeEventListener("pointerup", this.pointerOnCanvas);
            this.startButton.removeEventListener("click", this.startFight);
        }
        async moveCamera(_translate, _rotate, _timeMS) {
            const camera = Script.viewport?.camera;
            if (!camera)
                return;
            let elapsedTime = 0;
            const translationStart = camera.mtxPivot.translation.clone;
            const rotationStart = camera.mtxPivot.rotation.clone;
            const translationGoal = ƒ.Vector3.SUM(translationStart, _translate);
            const rotationGoal = ƒ.Vector3.SUM(rotationStart, _rotate);
            return new Promise((resolve) => {
                const mover = () => {
                    const delta = ƒ.Loop.timeFrameGame;
                    elapsedTime += delta;
                    if (elapsedTime > _timeMS) {
                        camera.mtxPivot.translation = translationGoal;
                        camera.mtxPivot.rotation = rotationGoal;
                        ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, mover);
                        resolve();
                        return;
                    }
                    camera.mtxPivot.translation = ƒ.Vector3.LERP(translationStart, translationGoal, elapsedTime / _timeMS);
                    camera.mtxPivot.rotation = ƒ.Vector3.LERP(rotationStart, rotationGoal, elapsedTime / _timeMS);
                };
                ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, mover);
            });
        }
    }
    Script.FightPrepUI = FightPrepUI;
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
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.initStones();
            document.getElementById("FightGoldCounterWrapper").appendChild(Script.GoldDisplayElement.element);
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
    class FightRewardUI extends Script.UILayer {
        constructor() {
            super();
            this.eumlings = new Map();
            this.clickOnEumling = (_ev) => {
                if (this.xp <= 0)
                    return;
                let target = _ev.currentTarget;
                let eumling = this.eumlings.get(target);
                if (!eumling)
                    return;
                this.eumlings.keys().forEach(el => el.classList.remove("selected"));
                target.classList.add("selected");
                this.showAndUpdateInfo(eumling);
            };
            this.clickOnConfirm = () => {
                if (!this.selectedEumling)
                    return;
                this.selectedEumling.addXP(1);
                this.xp--;
                this.updateXPText();
                this.showAndUpdateInfo(this.selectedEumling);
                if (this.xp <= 0) {
                    this.continueButtonWrapper.classList.remove("hidden");
                    this.hideInfo();
                }
            };
            this.eumlingLevelup = () => {
                this.eumlings.forEach((eum, el) => {
                    el.appendChild(Script.EumlingUIElement.getUIElement(eum).element);
                });
            };
            this.convert = () => {
                Script.Run.currentRun.changeGold(this.xp);
                this.gold += this.xp;
                document.getElementById("FightRewardRewards").querySelector(".Gold span").innerHTML = `${this.gold}`;
                this.xp = 0;
                this.continueButtonWrapper.classList.remove("hidden");
                this.convertButton.disabled = true;
                this.convertButton.classList.add("hidden");
                this.updateXPText();
                this.hideInfo();
            };
            this.finishRewards = () => {
                Script.EventBus.dispatchEvent({ type: Script.EVENT.REWARDS_CLOSE });
            };
            this.removeOverlay = (_ev) => {
                const target = _ev.target;
                if (target.classList.contains("clickable"))
                    return;
                if (target.classList.contains("selectable"))
                    return;
                if (target.tagName === "button")
                    return;
                this.hideInfo();
                this.selectedEumling = undefined;
                this.eumlings.keys().forEach(el => el.classList.remove("selected"));
            };
            this.element = document.getElementById("FightReward");
            this.infoElement = document.getElementById("FightRewardInfo");
            this.rewardsOverivew = document.getElementById("FightRewardRewards");
            this.continueButtonWrapper = document.getElementById("FightRewardContinueWrapper");
            this.convertButton = document.getElementById("FightRewardConvert");
            this.confirmButton = document.getElementById("FightRewardConfirm");
            this.cancelButton = document.getElementById("FightRewardCancel");
        }
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            let { gold, xp, stones } = _ev.detail;
            const rewardIcons = [];
            if (gold) {
                rewardIcons.push(Script.createElementAdvanced("div", {
                    innerHTML: `<span>${gold}</span>`,
                    classes: ["FightRewardIcon", "Gold"]
                }));
                this.gold = gold;
            }
            if (xp) {
                rewardIcons.push(Script.createElementAdvanced("div", {
                    innerHTML: `<span>${xp}</span>`,
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
            this.eumlings.clear();
            for (let eumling of Script.Run.currentRun.eumlings) {
                let uiElement = Script.createElementAdvanced("div", { classes: ["selectable", "clickable"] });
                uiElement.appendChild(Script.EumlingUIElement.getUIElement(eumling).element);
                this.eumlings.set(uiElement, eumling);
                uiElement.classList.remove("hidden");
                uiElement.addEventListener("click", this.clickOnEumling);
            }
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
            this.updateXPText();
            this.continueButtonWrapper.classList.add("hidden");
            this.convertButton.disabled = false;
            this.convertButton.classList.remove("hidden");
            this.hideInfo();
        }
        async onShow() {
            super.onShow();
            this.addEventListeners();
            this.eumlings.forEach((eum, el) => {
                el.appendChild(Script.EumlingUIElement.getUIElement(eum).element);
            });
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
        }
        async onHide() {
            super.onHide();
            this.removeEventListeners();
        }
        showAndUpdateInfo(eumling) {
            this.selectedEumling = eumling;
            this.infoElement.parentElement.classList.remove("hidden");
            this.infoElement.innerHTML = `
            <span class="InfoTitle">${eumling.type}</span>
            <span class="Info">${eumling.currentHealth} / ${eumling.health}♥️</span>
            <span class="Info">${eumling.xp} / ${eumling.requiredXPForLevelup}XP</span>
            <span class="Info">${eumling.info}</span>`;
        }
        hideInfo() {
            this.infoElement.parentElement.classList.add("hidden");
        }
        updateXPText() {
            document.getElementById("FightRewardXPAmount").innerText = this.xp.toString();
            this.convertButton.disabled = this.xp === 0;
            this.convertButton.disabled ? this.convertButton.classList.add("hidden") : this.convertButton.classList.remove("hidden");
        }
        addEventListeners() {
            this.cancelButton.addEventListener("click", this.removeOverlay);
            this.continueButtonWrapper.addEventListener("click", this.finishRewards);
            this.convertButton.addEventListener("click", this.convert);
            this.confirmButton.addEventListener("click", this.clickOnConfirm);
            Script.EventBus.addEventListener(Script.EVENT.EUMLING_LEVELUP_CHOSEN, this.eumlingLevelup);
        }
        removeEventListeners() {
            for (let element of this.eumlings.keys()) {
                element.removeEventListener("click", this.clickOnEumling);
            }
            this.cancelButton.removeEventListener("click", this.removeOverlay);
            this.continueButtonWrapper.removeEventListener("click", this.finishRewards);
            this.convertButton.removeEventListener("click", this.convert);
            this.confirmButton.removeEventListener("click", this.clickOnConfirm);
            Script.EventBus.removeEventListener(Script.EVENT.EUMLING_LEVELUP_CHOSEN, this.eumlingLevelup);
        }
    }
    Script.FightRewardUI = FightRewardUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class EumlingLevelupUI extends Script.UILayer {
        static { this.orientationInfo = new Map([
            ["R", "Realistic"],
            ["I", "Investigating"],
            ["A", "Artistic"],
            ["S", "Social"],
            ["E", "Enterprising"],
            ["C", "Conventional"],
        ]); }
        constructor() {
            super();
            this.selectOption = (_ev) => {
                const element = _ev.currentTarget;
                this.selectedOption = element.dataset.option;
                this.confirmButton.classList.remove("hidden");
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
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.confirmButton.classList.add("hidden");
            this.eumling = _ev.target;
            let specialisationOptions = this.eumling.types.length === 1 ? ["A", "I"] : ["C", "E"];
            this.eumlingElement.replaceChildren(Script.EumlingUIElement.getUIElement(this.eumling).element);
            const optionElements = [];
            for (let option of specialisationOptions) {
                const elem = Script.createElementAdvanced("div", {
                    classes: ["LevelupOption", "selectable", "clickable"],
                    innerHTML: `<span class="LevelupLetter">+ ${option}</span>
                    <span>${EumlingLevelupUI.orientationInfo.get(option)}</span>`,
                    attributes: [["data-option", option]],
                });
                optionElements.push(elem);
                elem.addEventListener("click", (_ev) => {
                    this.selectOption(_ev);
                    const newEumlingType = this.eumling.types.join("") + option + "-Eumling";
                    this.infoElement.innerText = Script.Provider.data.getEntity(newEumlingType).info;
                });
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
            this.stoneToHtmlElement = new Map();
            this.hideOverlay = () => {
                this.infoOverlay.classList.add("hidden");
                this.selectedStone = undefined;
                this.updateCostDisplays();
            };
            this.currentSelectedStoneIsAnUpgrade = false;
            this.confirm = () => {
                if (!this.selectedStone)
                    return this.hideOverlay();
                if (this.currentSelectedStoneIsAnUpgrade) {
                    this.upgradeStone();
                }
                else {
                    this.buyStone();
                }
                this.hideOverlay();
            };
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
            this.info = document.getElementById("ShopInfo");
            this.infoOverlay = document.getElementById("ShopInfoOverlayWrapper");
            this.stoneRefreshButton = document.getElementById("ShopStonesRefresh");
            this.confirmButton = document.getElementById("ShopStonesBuy");
            this.stoneUpgradeInfo = document.getElementById("ShopStonesUpgradeInfo");
            this.stoneUpgradeWrapper = document.getElementById("ShopStoneUpgrades");
            this.eumlingHealWrapper = document.getElementById("ShopEumlingHeal");
        }
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            this.setupStonesToBuy();
            this.setupStonesToUpgrade();
            this.initEumlingHealing();
            this.hideOverlay();
            document.getElementById("ShopGoldWrapper").appendChild(Script.GoldDisplayElement.element);
        }
        setupStonesToBuy() {
            this.stoneRefreshButton.disabled = Script.Run.currentRun.gold < COST.REFRESH;
            const existingStones = Script.Run.currentRun.stones.map((stone) => stone.data);
            const newStones = Script.chooseRandomElementsFromArray(Script.Provider.data.stones, 2, existingStones);
            if (newStones.length === 0) {
                this.stonesWrapper.replaceChildren(Script.createElementAdvanced("p", { innerHTML: "No more stones available." }));
                this.stoneRefreshButton.disabled = true;
                return;
            }
            const newStoneElements = [];
            for (let stoneData of newStones) {
                let level = (Math.random() < 0.2) ? 1 : 0;
                let cost = level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
                let stone = new Script.Stone(stoneData, level);
                let uiStoneElement = Script.StoneUIElement.getUIElement(stone);
                let wrapper = Script.createElementAdvanced("div", {
                    classes: ["BuyStone", "ShopOption", "clickable", "selectable"],
                    attributes: [["data-level", level.toString()], ["data-cost", cost.toString()]],
                    innerHTML: `<span class="GoldDisplay">${cost}</span>`
                });
                wrapper.prepend(uiStoneElement.element);
                newStoneElements.push(wrapper);
                this.stoneToHtmlElement.set(stone, wrapper);
                wrapper.addEventListener("click", () => {
                    this.showOverlay(stone, cost, false);
                });
            }
            this.stonesWrapper.replaceChildren(...newStoneElements);
            this.updateCostDisplays();
        }
        buyStone() {
            const stone = this.selectedStone;
            if (!stone)
                return;
            const cost = stone.level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
            if (Script.Run.currentRun.gold < cost)
                return;
            Script.Run.currentRun.changeGold(-cost);
            Script.EventBus.dispatchEvent({ type: Script.EVENT.CHOSEN_STONE, detail: { stone } });
            this.stoneToHtmlElement.get(stone)?.remove();
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
                    classes: ["ShopOption", "clickable", "selectable"],
                    innerHTML: `<span class="GoldDisplay">${COST.UPGRADE_STONE}</span>`,
                    attributes: [["data-cost", COST.UPGRADE_STONE.toString()]],
                });
                element.prepend(Script.StoneUIElement.getUIElement(stone).element);
                upgradeStoneElements.push(element);
                element.addEventListener("click", () => {
                    this.showOverlay(stone, COST.UPGRADE_STONE, true);
                });
                this.stoneToHtmlElement.set(stone, element);
            }
            this.stoneUpgradeWrapper.replaceChildren(...upgradeStoneElements);
        }
        upgradeStone() {
            const stone = this.selectedStone;
            if (!stone)
                return;
            const cost = COST.UPGRADE_STONE;
            if (Script.Run.currentRun.gold < cost)
                return;
            Script.Run.currentRun.changeGold(-cost);
            stone.level++;
            this.stoneToHtmlElement.get(stone)?.remove();
            this.setupStonesToUpgrade();
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
                    classes: ["ShopOption", "clickable", "selectable"],
                    innerHTML: `<span class="GoldDisplay">${COST.HEAL_EUMLING}</span>`,
                    attributes: [["data-cost", COST.HEAL_EUMLING.toString()]]
                });
                wrapper.prepend(Script.EumlingUIElement.getUIElement(eumling).element);
                wrapper.addEventListener("click", () => {
                    if (Script.Run.currentRun.gold < COST.HEAL_EUMLING)
                        return;
                    Script.Run.currentRun.changeGold(-COST.HEAL_EUMLING);
                    eumling.affect({ type: Script.SPELL_TYPE.HEAL, level: 1, target: undefined });
                    if (eumling.currentHealth >= eumling.health)
                        wrapper.remove();
                    this.updateCostDisplays();
                });
            }
            this.eumlingHealWrapper.replaceChildren(...elements);
        }
        showOverlay(_stone, _cost, _upgrade) {
            if (_cost > Script.Run.currentRun.gold)
                return;
            this.infoOverlay.classList.remove("hidden");
            this.selectedStone = _stone;
            this.currentSelectedStoneIsAnUpgrade = _upgrade;
            const level = _stone.level + Number(_upgrade);
            this.info.innerHTML = `
                <span class="InfoTitle">${_stone.id}</span>
                <span class="InfoSmaller">Level ${level + 1}</span>
                <span class="Info">${_stone.data.abilityLevels[level].info}</span>
                <span class="GoldDisplay">${_cost}</span>`;
            this.infoOverlay.style.setProperty("--stone-url", `url("./Assets/UIElemente/Stones/${_stone.id}.png")`);
            this.infoOverlay.dataset.level = level.toString();
            this.confirmButton.innerText = _upgrade ? "Upgrade" : "Buy";
        }
        updateCostDisplays() {
            const elements = this.element.querySelectorAll("[data-cost]");
            for (let element of elements) {
                const cost = Number(element.dataset.cost);
                if (cost > Script.Run.currentRun.gold) {
                    element.classList.add("too-expensive");
                }
                else {
                    element.classList.remove("too-expensive");
                }
            }
        }
        addEventListeners() {
            this.closeButton.addEventListener("click", this.close);
            this.stoneRefreshButton.addEventListener("click", this.refresh);
            document.getElementById("ShopStonesCancel").addEventListener("click", this.hideOverlay);
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners() {
            this.closeButton.removeEventListener("click", this.close);
            this.stoneRefreshButton.removeEventListener("click", this.refresh);
            document.getElementById("ShopStonesCancel").removeEventListener("click", this.hideOverlay);
            this.confirmButton.removeEventListener("click", this.confirm);
        }
    }
    Script.ShopUI = ShopUI;
})(Script || (Script = {}));
/// <reference path="UILayer.ts" />
var Script;
/// <reference path="UILayer.ts" />
(function (Script) {
    class RunEndUI extends Script.UILayer {
        constructor() {
            super();
            this.close = () => {
                Script.Provider.GUI.removeAllLayers();
                Script.Provider.GUI.addUI("start");
                Script.Provider.GUI.addUI("mainMenu");
            };
            this.element = document.getElementById("RunEnd");
            this.continueButton = document.getElementById("RunEndMainMenu");
        }
        async onAdd(_zindex, _ev) {
            super.onAdd(_zindex, _ev);
            document.getElementById("RunEndInner").innerHTML =
                _ev.detail.success ?
                    `<h2>Success!</h2>
            <p>You won! :)</p>` :
                    `<h2>Defeat!</h2>
            <p>You lost. :(</p>`;
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
/// <reference path="StartScreenUI.ts" />
/// <reference path="LoadingScreenUI.ts" />
/// <reference path="MainMenuUI.ts" />
/// <reference path="OptionsUI.ts" />
/// <reference path="ChooseEumlingUI.ts" />
/// <reference path="ChooseStoneUI.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="FightPrepUI.ts" />
/// <reference path="FightUI.ts" />
/// <reference path="FightRewardUI.ts" />
/// <reference path="EumlingLevelupUI.ts" />
/// <reference path="ShopUI.ts" />
/// <reference path="RunEndUI.ts" />
var Script;
/// <reference path="StartScreenUI.ts" />
/// <reference path="LoadingScreenUI.ts" />
/// <reference path="MainMenuUI.ts" />
/// <reference path="OptionsUI.ts" />
/// <reference path="ChooseEumlingUI.ts" />
/// <reference path="ChooseStoneUI.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="FightPrepUI.ts" />
/// <reference path="FightUI.ts" />
/// <reference path="FightRewardUI.ts" />
/// <reference path="EumlingLevelupUI.ts" />
/// <reference path="ShopUI.ts" />
/// <reference path="RunEndUI.ts" />
(function (Script) {
    // TODO: add Provider to pass UI elements without hardcoding???
    class VisualizeGUI {
        constructor() {
            this.uis = new Map();
            this.activeLayers = [];
            this.switchUI = async (_ev) => {
                switch (_ev.type) {
                    case Script.EVENT.FIGHT_START: {
                        await this.replaceUI("fight", _ev);
                        break;
                    }
                    case Script.EVENT.CHOOSE_STONE: {
                        await this.replaceUI("chooseStone", _ev);
                        break;
                    }
                    case Script.EVENT.CHOOSE_EUMLING: {
                        await this.replaceUI("chooseEumling", _ev);
                        break;
                    }
                    case Script.EVENT.CHOOSE_ENCOUNTER: {
                        await this.replaceUI("chooseEncounter", _ev);
                        break;
                    }
                    case Script.EVENT.FIGHT_PREPARE: {
                        await this.replaceUI("fightPrepare", _ev);
                        break;
                    }
                    case Script.EVENT.REWARDS_OPEN: {
                        await this.replaceUI("fightReward", _ev);
                        break;
                    }
                    case Script.EVENT.EUMLING_LEVELUP_CHOOSE: {
                        await this.addUI("eumlingLevelup", _ev);
                        break;
                    }
                    case Script.EVENT.SHOP_OPEN: {
                        await this.replaceUI("shop", _ev);
                        break;
                    }
                    case Script.EVENT.RUN_END: {
                        await this.replaceUI("runEnd", _ev);
                        break;
                    }
                }
            };
            this.uis.clear();
            this.uis.set("start", new Script.StartScreenUI());
            this.uis.set("loading", new Script.LoadingScreenUI());
            this.uis.set("mainMenu", new Script.MainMenuUI());
            this.uis.set("options", new Script.OptionsUI());
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
            this.replaceUI("start");
        }
        get topmostLevel() {
            if (this.activeLayers.length === 0)
                return undefined;
            return this.activeLayers[this.activeLayers.length - 1];
        }
        async addUI(_id, _ev) {
            let ui = this.uis.get(_id);
            if (!ui)
                return;
            let prevTop = this.topmostLevel;
            if (prevTop)
                await prevTop.onHide();
            this.activeLayers.push(ui);
            await ui.onAdd(1000 + this.activeLayers.length, _ev);
        }
        async replaceUI(_id, _ev) {
            await this.removeTopmostUI();
            await this.addUI(_id, _ev);
        }
        async removeTopmostUI() {
            let last = this.activeLayers.pop();
            await last?.onHide();
            await last?.onRemove();
            let newTop = this.topmostLevel;
            if (newTop)
                await newTop.onShow();
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
                this.#visualizer = new Script.Visualizer();
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
    let visualizer;
    document.addEventListener("click", startLoading, { once: true });
    Script.Provider.setVisualizer();
    async function startLoading() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR)
            return;
        new Script.MusicManager();
        Script.Provider.GUI.addUI("loading");
        Script.viewport = await Script.loadResourcesAndInitViewport(document.getElementById("GameCanvas"));
        await initProvider();
        Script.Provider.GUI.replaceUI("mainMenu");
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    Script.startLoading = startLoading;
    async function initProvider() {
        await Script.Provider.data.load();
        visualizer = Script.Provider.visualizer;
        visualizer.initializeScene(Script.viewport);
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    async function run() {
        const run = new Script.Run();
        run.start();
    }
    Script.run = run;
    function setupSounds(camera) {
        ƒ.AudioManager.default.listenTo(Script.viewport.getBranch());
        ƒ.AudioManager.default.listenWith(camera.getComponent(ƒ.ComponentAudioListener));
    }
    Script.setupSounds = setupSounds;
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
        if (!_array)
            return [];
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
    async function getDuplicateOfNode(_node) {
        let newNode = new ƒ.Node(_node.name);
        await newNode.deserialize(_node.serialize());
        return newNode;
    }
    Script.getDuplicateOfNode = getDuplicateOfNode;
    function getPickableObjectsFromClientPos(_pos) {
        const ray = Script.viewport.getRayFromClient(_pos);
        const picks = Script.PickSphere.pick(ray, { sortBy: "distanceToRay" });
        return picks;
    }
    Script.getPickableObjectsFromClientPos = getPickableObjectsFromClientPos;
    function randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let counter = 0; counter < length; counter++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    Script.randomString = randomString;
    function enumToArray(anEnum) {
        return Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n));
    }
    Script.enumToArray = enumToArray;
    function findFirstComponentInGraph(_graph, _cmp) {
        let foundCmp = _graph.getComponent(_cmp);
        if (foundCmp)
            return foundCmp;
        for (let child of _graph.getChildren()) {
            foundCmp = findFirstComponentInGraph(child, _cmp);
            if (foundCmp)
                return foundCmp;
        }
        return undefined;
    }
    Script.findFirstComponentInGraph = findFirstComponentInGraph;
    async function loadResourcesAndInitViewport(canvas) {
        await ƒ.Project.loadResourcesFromHTML();
        let graphId /* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        let graph = ƒ.Project.resources[graphId];
        let viewport = new ƒ.Viewport();
        let camera = findFirstComponentInGraph(graph, ƒ.ComponentCamera);
        viewport.initialize("game", graph, camera, canvas);
        return viewport;
    }
    Script.loadResourcesAndInitViewport = loadResourcesAndInitViewport;
    async function moveNodeOverTime(_node, _translationTarget, _rotationTarget, _timeMS) {
        if (!_node)
            return;
        let elapsedTime = 0;
        const translationStart = _node.mtxLocal.translation.clone;
        const rotationStart = _node.mtxLocal.rotation.clone;
        return new Promise((resolve) => {
            const mover = () => {
                const delta = ƒ.Loop.timeFrameGame;
                elapsedTime += delta;
                if (elapsedTime > _timeMS) {
                    _node.mtxLocal.translation = _translationTarget;
                    _node.mtxLocal.rotation = _rotationTarget;
                    ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, mover);
                    resolve();
                    return;
                }
                _node.mtxLocal.translation = ƒ.Vector3.LERP(translationStart, _translationTarget, elapsedTime / _timeMS);
                _node.mtxLocal.rotation = ƒ.Vector3.LERP(rotationStart, _rotationTarget, elapsedTime / _timeMS);
            };
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, mover);
        });
    }
    Script.moveNodeOverTime = moveNodeOverTime;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Settings {
        static { this.settings = []; }
        static proxySetting(_setting, onValueChange) {
            return new Proxy(_setting, {
                set(target, prop, newValue, receiver) {
                    if (prop === "value")
                        onValueChange(target[prop], newValue);
                    return Reflect.set(target, prop, newValue, receiver);
                },
            });
        }
        static addSettings(..._settings) {
            _settings.forEach(setting => this.settings.push(setting));
        }
        static generateHTML(_settings = this.settings) {
            const wrapper = Script.createElementAdvanced("div", { classes: ["settings-wrapper"], innerHTML: "<h2 class='h'><span>Settings</span></h2>" });
            for (let setting of _settings) {
                wrapper.appendChild(this.generateSingleHTML(setting));
            }
            return wrapper;
        }
        static generateSingleHTML(_setting) {
            let element;
            switch (_setting.type) {
                case "string": {
                    element = this.generateStringInput(_setting);
                    break;
                }
                case "number": {
                    element = this.generateNumberInput(_setting);
                    break;
                }
                case "category": {
                    element = Script.createElementAdvanced("div", { classes: ["settings-category"], innerHTML: `<span class="settings-category-name">${_setting.name}</span>` });
                    for (let setting of _setting.settings) {
                        element.appendChild(this.generateSingleHTML(setting));
                    }
                    break;
                }
                default: {
                    element = Script.createElementAdvanced("div", { innerHTML: "Unknown Setting Type", classes: ["settings-unknown"] });
                }
            }
            return element;
        }
        static generateStringInput(_setting) {
            const id = Script.randomString(10);
            const element = Script.createElementAdvanced("label", { classes: ["settings-string-wrapper", "settings-label"], innerHTML: `<span class="settings-string-label settings-label-text">${_setting.name}</span>`, attributes: [["for", id]] });
            const input = Script.createElementAdvanced("input", { classes: ["settings-string-input", "settings-input"], attributes: [["type", "string"], ["value", _setting.value], ["name", id]], id });
            element.appendChild(input);
            input.addEventListener("change", () => {
                _setting.value = input.value;
            });
            return element;
        }
        static generateNumberInput(_setting) {
            const id = Script.randomString(10);
            const element = Script.createElementAdvanced("label", { classes: ["settings-number-wrapper", "settings-label", _setting.name.toLowerCase()], innerHTML: `<span class="settings-number-label settings-label-text">${_setting.name}</span>`, attributes: [["for", id]] });
            switch (_setting.variant) {
                case "percent": {
                    const buttonMinus = Script.createElementAdvanced("button", {
                        classes: ["settings-number-input-button", "minus", "settings-input"],
                        innerHTML: "-"
                    });
                    const input = Script.createElementAdvanced("input", {
                        classes: ["settings-number-input", "settings-input", "number-input"],
                        attributes: [["type", "number"], ["value", (_setting.value * 100).toString()], ["name", id], ["min", (_setting.min * 100).toString()], ["max", (_setting.max * 100).toString()], ["step", (_setting.step * 100).toString()]],
                        id
                    });
                    const buttonPlus = Script.createElementAdvanced("button", {
                        classes: ["settings-number-input-button", "plus", "settings-input"],
                        innerHTML: "+"
                    });
                    element.append(buttonMinus, input, buttonPlus);
                    input.addEventListener("change", () => {
                        let value = Math.min(_setting.max, Math.max(_setting.min, Number(input.value) / 100));
                        _setting.value = value;
                        input.value = Math.round(value * 100).toString();
                    });
                    buttonMinus.addEventListener("click", () => { input.stepDown(); input.dispatchEvent(new InputEvent("change")); });
                    buttonPlus.addEventListener("click", () => { input.stepUp(); input.dispatchEvent(new InputEvent("change")); });
                    break;
                }
                case "range": {
                    const input = Script.createElementAdvanced("input", {
                        classes: ["settings-number-input", "settings-input", "slider"],
                        attributes: [["type", "range"], ["value", _setting.value.toString()], ["name", id], ["min", _setting.min.toString()], ["max", _setting.max.toString()], ["step", _setting.step.toString()]],
                        id
                    });
                    input.addEventListener("input", () => {
                        _setting.value = Number(input.value);
                        const percent = _setting.value / (_setting.max - _setting.min) * 100;
                        input.style.setProperty("--percent", `${percent}%`);
                    });
                    break;
                }
            }
            return element;
        }
    }
    Script.Settings = Settings;
})(Script || (Script = {}));
/// <reference path="../Misc/Utils.ts" />
/// <reference path="../Plugins/Settings.ts" />
var Script;
/// <reference path="../Misc/Utils.ts" />
/// <reference path="../Plugins/Settings.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    let AUDIO_CHANNEL;
    (function (AUDIO_CHANNEL) {
        AUDIO_CHANNEL[AUDIO_CHANNEL["MASTER"] = 0] = "MASTER";
        AUDIO_CHANNEL[AUDIO_CHANNEL["SOUNDS"] = 1] = "SOUNDS";
        AUDIO_CHANNEL[AUDIO_CHANNEL["MUSIC"] = 2] = "MUSIC";
    })(AUDIO_CHANNEL = Script.AUDIO_CHANNEL || (Script.AUDIO_CHANNEL = {}));
    const enumToName = new Map([
        [AUDIO_CHANNEL.MASTER, "Master"],
        [AUDIO_CHANNEL.MUSIC, "Music"],
        [AUDIO_CHANNEL.SOUNDS, "Sounds"],
    ]);
    class AudioManager {
        static { this.Instance = new AudioManager(); }
        constructor() {
            this.gainNodes = {};
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            if (AudioManager.Instance)
                return AudioManager.Instance;
            const settingCategory = { name: "Sound", settings: [], type: "category" };
            for (let channel of Script.enumToArray(AUDIO_CHANNEL)) {
                this.gainNodes[channel] = ƒ.AudioManager.default.createGain();
                if (channel === AUDIO_CHANNEL.MASTER) {
                    this.gainNodes[channel].connect(ƒ.AudioManager.default.gain);
                }
                else {
                    this.gainNodes[channel].connect(this.gainNodes[AUDIO_CHANNEL.MASTER]);
                }
                let setting = { type: "number", max: 1, min: 0, name: enumToName.get(channel), step: 0.2, value: 1, variant: "percent" };
                setting = Script.Settings.proxySetting(setting, (_old, _new) => { AudioManager.setChannelVolume(channel, _new); });
                settingCategory.settings.push(setting);
            }
            Script.Settings.addSettings(settingCategory);
        }
        static addAudioCmpToChannel(_cmpAudio, _channel) {
            _cmpAudio.setGainTarget(AudioManager.Instance.gainNodes[_channel]);
        }
        static setChannelVolume(_channel, _volume) {
            let channel = AudioManager.Instance.gainNodes[_channel];
            if (!channel)
                return;
            channel.gain.value = _volume;
        }
    }
    Script.AudioManager = AudioManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let ComponentAudioMixed = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.ComponentAudio;
        let _instanceExtraInitializers = [];
        let _get_channel_decorators;
        var ComponentAudioMixed = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_channel_decorators = [ƒ.serialize(Script.AUDIO_CHANNEL)];
                __esDecorate(this, null, _get_channel_decorators, { kind: "getter", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentAudioMixed = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(ComponentAudioMixed); }
            #channel = (__runInitializers(this, _instanceExtraInitializers), Script.AUDIO_CHANNEL.MASTER);
            constructor(_audio, _loop, _start, _audioManager = ƒ.AudioManager.default, _channel = Script.AUDIO_CHANNEL.MASTER) {
                super(_audio, _loop, _start, _audioManager);
                this.gainTarget = _audioManager.gain;
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                this.channel = _channel;
            }
            get channel() {
                return this.#channel;
            }
            set channel(_channel) {
                this.#channel = _channel;
                Script.AudioManager.addAudioCmpToChannel(this, this.#channel);
            }
            setGainTarget(node) {
                if (this.isConnected) {
                    this.gain.disconnect(this.gainTarget);
                }
                this.gainTarget = node;
                if (this.isConnected) {
                    this.gain.connect(this.gainTarget);
                }
            }
            connect(_on) {
                if (_on)
                    this.gain.connect(this.gainTarget ?? this.audioManager.gain);
                else
                    this.gain.disconnect(this.gainTarget ?? this.audioManager.gain);
                this.isConnected = _on;
            }
            fadeTo(_volume, _duration) {
                // (<GainNode>this.gain).gain.linearRampToValueAtTime(_volume, ƒ.AudioManager.default.currentTime + _duration);
                this.gain.gain.setValueCurveAtTime([this.volume, _volume], ƒ.AudioManager.default.currentTime, _duration);
            }
            drawGizmos() {
                if (this.isPlaying)
                    super.drawGizmos();
            }
            play(_on) {
                super.play(_on);
                // Hacky bullshit because super.play creates a new source every time and the ƒ.EVENT_AUDIO.ENDED isn't fired at all
                this.source.addEventListener("ended", () => {
                    this.dispatchEvent(new CustomEvent("ended" /* ƒ.EVENT_AUDIO.ENDED */));
                });
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentAudioMixed = _classThis;
    })();
    Script.ComponentAudioMixed = ComponentAudioMixed;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let MUSIC_TITLE;
    (function (MUSIC_TITLE) {
        MUSIC_TITLE[MUSIC_TITLE["COMBAT_INTRO"] = 0] = "COMBAT_INTRO";
        MUSIC_TITLE[MUSIC_TITLE["COMBAT_PICKUP"] = 1] = "COMBAT_PICKUP";
        MUSIC_TITLE[MUSIC_TITLE["COMBAT_LOOP"] = 2] = "COMBAT_LOOP";
        MUSIC_TITLE[MUSIC_TITLE["SHOP_LOOP"] = 3] = "SHOP_LOOP";
        MUSIC_TITLE[MUSIC_TITLE["TITLE_INTRO"] = 4] = "TITLE_INTRO";
        MUSIC_TITLE[MUSIC_TITLE["TITLE_LOOP"] = 5] = "TITLE_LOOP";
    })(MUSIC_TITLE || (MUSIC_TITLE = {}));
    let MUSIC;
    (function (MUSIC) {
        MUSIC[MUSIC["COMBAT"] = 0] = "COMBAT";
        MUSIC[MUSIC["SHOP"] = 1] = "SHOP";
        MUSIC[MUSIC["TITLE"] = 2] = "TITLE";
    })(MUSIC || (MUSIC = {}));
    class MusicManager {
        constructor() {
            this.sounds = new Map([
                [MUSIC_TITLE.COMBAT_INTRO, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Music/Combat/Combat_Intro.opus"), false, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.COMBAT_LOOP, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Music/Combat/Combat_Loop.opus"), true, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.COMBAT_PICKUP, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Music/Combat/Combat_Pickup.opus"), false, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.SHOP_LOOP, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Music/Shop/Shop_Loop.opus"), true, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.TITLE_INTRO, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Music/Title/TitleMenu_Intro.opus"), false, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [MUSIC_TITLE.TITLE_LOOP, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Music/Title/TitleMenu_Loop.opus"), true, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
            ]);
            for (let cmp of this.sounds.values())
                [
                    cmp.connect(true)
                ];
            this.addEventListeners();
            this.setupIntros();
            this.changeMusic(MUSIC.TITLE);
        }
        setupIntros() {
            this.sounds.get(MUSIC_TITLE.TITLE_INTRO).addEventListener("ended" /* ƒ.EVENT_AUDIO.ENDED */, () => {
                if (this.activeMusic === MUSIC.TITLE) {
                    this.playTitle(MUSIC_TITLE.TITLE_LOOP);
                }
            });
            this.sounds.get(MUSIC_TITLE.COMBAT_INTRO).addEventListener("ended" /* ƒ.EVENT_AUDIO.ENDED */, () => {
                if (this.activeMusic === MUSIC.COMBAT) {
                    this.playTitle(MUSIC_TITLE.COMBAT_LOOP);
                    this.sounds.get(MUSIC_TITLE.SHOP_LOOP).play(true);
                    this.sounds.get(MUSIC_TITLE.SHOP_LOOP).volume = 0;
                }
            });
            // this.sounds.get(MUSIC_TITLE.COMBAT_PICKUP).addEventListener(ƒ.EVENT_AUDIO.ENDED, () => {
            //     if (this.activeMusic === MUSIC.COMBAT) {
            //         this.playTitle(MUSIC_TITLE.COMBAT_LOOP);
            //     }
            // });
        }
        changeMusic(_music) {
            if (this.activeMusic === _music)
                return;
            switch (_music) {
                case MUSIC.COMBAT: {
                    if (this.activeMusic === MUSIC.TITLE) {
                        this.playTitle(MUSIC_TITLE.COMBAT_INTRO, 1);
                    }
                    else if (this.activeMusic === MUSIC.SHOP) {
                        this.sounds.get(MUSIC_TITLE.SHOP_LOOP).fadeTo(0, 0.01);
                        this.sounds.get(MUSIC_TITLE.COMBAT_PICKUP).play(true);
                        this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).volume = 0;
                        this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).play(true);
                        setTimeout(() => {
                            this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).fadeTo(1, 0.01);
                            this.sounds.get(MUSIC_TITLE.COMBAT_PICKUP).fadeTo(0, 3);
                        }, 4750);
                    }
                    break;
                }
                case MUSIC.SHOP: {
                    if (this.activeMusic !== MUSIC.COMBAT)
                        return;
                    // make sure the sound is actually playing
                    if (!this.sounds.get(MUSIC_TITLE.SHOP_LOOP).isPlaying) {
                        this.playTitle(MUSIC_TITLE.COMBAT_LOOP);
                        this.sounds.get(MUSIC_TITLE.SHOP_LOOP).play(true);
                        setTimeout(() => {
                            this.sounds.get(MUSIC_TITLE.COMBAT_LOOP).volume = 0;
                        }, 100);
                    }
                    else {
                        this.activeComponent.fadeTo(0, 2);
                        this.sounds.get(MUSIC_TITLE.SHOP_LOOP).fadeTo(1, 2);
                    }
                    break;
                }
                case MUSIC.TITLE: {
                    this.playTitle(MUSIC_TITLE.TITLE_INTRO, 1);
                    break;
                }
            }
            this.activeMusic = _music;
        }
        playTitle(_title, _fadeTime = 0.01) {
            console.log("play title", _title, this.activeComponent, _fadeTime);
            const cmp = this.sounds.get(_title);
            if (!cmp)
                return;
            cmp.play(true);
            this.activeComponent?.fadeTo(0, _fadeTime);
            cmp.volume = 0;
            cmp.fadeTo(1, _fadeTime);
            this.activeComponent = cmp;
        }
        addEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.RUN_START, () => { this.changeMusic(MUSIC.COMBAT); });
            Script.EventBus.addEventListener(Script.EVENT.SHOP_OPEN, () => { this.changeMusic(MUSIC.SHOP); });
            Script.EventBus.addEventListener(Script.EVENT.SHOP_CLOSE, () => { this.changeMusic(MUSIC.COMBAT); });
            Script.EventBus.addEventListener(Script.EVENT.RUN_END, () => { this.changeMusic(MUSIC.TITLE); });
        }
    }
    Script.MusicManager = MusicManager;
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
                        spell: { type: Script.SPELL_TYPE.HEAL, level: 1 },
                        info: "Heals a random ally for 1 health at the end of the fight."
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: Script.SPELL_TYPE.HEAL, level: 1 },
                        info: "Heals two random allies for 1 health at the end of the fight."
                    }
                ]
            },
            {
                id: "shieldstone",
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 1 },
                        info: "Gives 1 shield to the ally with the lowest health at the start of the fight."
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.HEALTHIEST, reverse: true } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 2 },
                        info: "Gives 2 shield to the ally with the lowest health at the start of the fight."
                    }
                ]
            },
            {
                id: "brick",
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 1 },
                        info: "Gives 1 shield to each ally in the first row at the start of the fight."
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [0, 0], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.SHIELD, level: 2 },
                        info: "Gives 2 shield to each ally in the first row at the start of the fight."
                    }
                ]
            },
            {
                id: "knowledgestone", //TODO - 1 / 2 additional exp points
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 },
                        info: "SHOULD give 1 xp at the end of the fight. CURRENTLY JUST 1 GOLD"
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 },
                        info: "SHOULD give 2 xp at the end of the fight. CURRENTLY JUST 1 GOLD"
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
                        info: "SHOULD give a random buff to a random ally at the start of the fight. CURRENTLY JUST SHIELD 1"
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 2 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 },
                        info: "SHOULD give a random buff to two random allies at the start of the fight. CURRENTLY JUST 1 GOLD?"
                    }
                ]
            },
            {
                id: "punchstone", // Should deal 1 damage to a random enemy on fight start.
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.RANDOM }, },
                        attack: { baseDamage: 1 },
                        info: "Deals 1 damage to a random enemy at the start of the fight."
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 2, sortBy: Script.TARGET_SORT.RANDOM }, },
                        attack: { baseDamage: 1 },
                        info: "Deals 1 damage to two random enemies at the start of the fight."
                    }
                ]
            },
            {
                id: "warningstone", // Should give 1 random enemy weakness at fight start.
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.WEAKNESS, level: 1 },
                        info: "Gives 1 weakness to a random enemy at the start of the fight."
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.OPPONENT, entity: { maxNumTargets: 1, sortBy: Script.TARGET_SORT.STRONGEST } },
                        spell: { type: Script.SPELL_TYPE.WEAKNESS, level: 1 },
                        info: "Gives 1 weakness to the strongest enemy at the start of the fight."
                    }
                ]
            },
            {
                id: "glitterstone", //TODO - should reward 1 / 2 gold at the end of combat
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 1 },
                        info: "Gives 1 gold at the end of combat."
                    },
                    {
                        on: Script.EVENT.FIGHT_END,
                        target: { side: Script.TARGET_SIDE.ALLY, entity: { maxNumTargets: 1 } },
                        spell: { type: Script.SPELL_TYPE.GOLD, level: 2 },
                        info: "Gives 2 gold at the end of combat."
                    }
                ]
            },
            {
                id: "pointystone", // Should give all Eumlinge in the last row thorns
                abilityLevels: [
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 1 },
                        info: "Gives 1 thorns to all allies in the last row."
                    },
                    {
                        on: Script.EVENT.FIGHT_START,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 2 },
                        info: "Gives 2 thorns to all allies in the last row."
                    }
                ]
            },
            {
                id: "luckystone", // TODO - doubles the chance for rare stones
                abilityLevels: [
                    {
                        on: Script.EVENT.CHOOSE_STONE,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 1 },
                        info: "SHOULD Double the chance for rare stones to appear in the shop. CURRENTLY BROKEN",
                    },
                    {
                        on: Script.EVENT.CHOOSE_STONE,
                        target: { side: Script.TARGET_SIDE.ALLY, area: { absolutePosition: [2, 2], shape: Script.AREA_SHAPE.COLUMN, position: Script.AREA_POSITION.ABSOLUTE } },
                        spell: { type: Script.SPELL_TYPE.THORNS, level: 2 },
                        info: "SHOULD Triple the chance for rare stones to appear in the shop. CURRENTLY BROKEN",
                    }
                ]
            },
            {
                id: "steppingstone", // Deals 1 damage to enemies that move
                abilityLevels: [
                    {
                        on: Script.EVENT.ENTITY_MOVED,
                        conditions: { target: { side: Script.TARGET_SIDE.OPPONENT, entity: {} } },
                        target: "target",
                        attack: { baseDamage: 1 },
                        info: "Deals 1 damage to enemies whenever they move."
                    },
                    {
                        on: Script.EVENT.ENTITY_MOVED,
                        conditions: { target: { side: Script.TARGET_SIDE.OPPONENT, entity: {} } },
                        target: "target",
                        attack: { baseDamage: 2 },
                        info: "Deals 2 damage to enemies whenever they move."
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
            let moveData;
            moveData = this.select(this.moves, false)[0];
            if (moveData) {
                this.currentDirection = moveData.currentDirection;
            }
            else {
                this.currentDirection = [-1, 0];
            }
            //this.currentDirection = [-1,0]; //facing towards player Side
            this.updateEntityData(_entity);
            Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_CREATE, target: this });
            Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_CREATED, target: this });
            this.info = _entity.info;
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
            this.info = _newData.info;
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
            this.currentHealth = Math.max(0, this.currentHealth - amount);
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_HURT, target: this, cause: _cause, detail: { amount, crit: wasCrit } });
            if (this.currentHealth <= 0) {
                //this entity died
                this.removeEventListeners();
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
                    this.currentHealth = Math.min(this.health, this.currentHealth + amount);
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
        async tryToMove(_grid, maxAlternatives) {
            let moveData;
            //TODO: get all moves
            moveData = this.select(this.moves, false)[0];
            //check if the Entity has move data
            if (moveData) {
                for (let i = 0; i <= maxAlternatives && i <= moveData.blocked.attempts; i++) {
                    let rotateBy = (moveData.rotateBy ?? 0) + i * moveData.blocked.rotateBy;
                    //get the new position
                    let nextPosition = Script.getPositionBasedOnMove(this.position, this.currentDirection, moveData.distance, rotateBy);
                    //get the new direction
                    let nextDirection = Script.getNextDirection(rotateBy, this.currentDirection);
                    //check if the position is occupied or out of bounds
                    if (_grid.get(nextPosition) || Script.Grid.outOfBounds(nextPosition)) {
                        continue;
                    }
                    else if (_grid.get(nextPosition) == undefined) { //spot is free
                        //set the entity at the new position in the grid and remove the old one
                        _grid.set(nextPosition, this, true);
                        let oldPos = this.position;
                        this.position = nextPosition;
                        this.currentDirection = nextDirection;
                        //call move events
                        await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_MOVE, cause: this, target: this, trigger: moveData, detail: { entity: this, position: this.position, oldPosition: oldPos, direction: this.currentDirection, step: moveData.distance } });
                        await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_MOVED, cause: this, target: this, trigger: moveData, detail: { entity: this, position: this.position, oldPosition: oldPos, direction: this.currentDirection, step: moveData.distance } });
                        this.moved = true;
                        return true;
                    }
                }
            }
            else { // if the entity has no move data we just pretend it already moved
                this.moved = true;
                return true;
            }
            return false;
        }
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
            Script.EventBus.addEventListener(Script.EVENT.FIGHT_ENDED, this.endOfFightEventListener);
        }
        removeEventListeners() {
            for (let trigger of this.#triggers.values()) {
                Script.EventBus.removeEventListener(trigger, this.abilityEventListener);
            }
            Script.EventBus.removeEventListener(Script.EVENT.ROUND_END, this.endOfRoundEventListener);
            Script.EventBus.removeEventListener(Script.EVENT.FIGHT_ENDED, this.endOfFightEventListener);
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
                let validTargets = Script.getTargets(condition.target, _arena.home, _arena.away, this).targets;
                if (!validTargets.includes(_ev.target))
                    return false;
            }
            if (condition.cause && _arena && _ev.cause) {
                let validTargets = Script.getTargets(condition.cause, _arena.home, _arena.away, this).targets;
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
        if (!areAbilityConditionsMet.call(this, _ability, _arena, _ev))
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
            targets = Script.getTargets(_ability.target, _arena.home, _arena.away, this).targets;
        }
        // no targets found, no need to do the ability
        if (!targets || targets.length === 0)
            return;
        await Script.EventBus.dispatchEvent({ type: Script.EVENT.TRIGGER_ABILITY, cause: this, target: this, trigger: _ability });
        if (_ability.attack) {
            await executeAttack.call(this, [{ target: undefined, ..._ability.attack }], _arena.home, _arena.away, targets);
        }
        if (_ability.spell) {
            await executeSpell.call(this, [{ target: undefined, ..._ability.spell }], _arena.home, _arena.away, targets);
        }
        await Script.EventBus.dispatchEvent({ type: Script.EVENT.TRIGGERED_ABILITY, cause: this, target: this, trigger: _ability });
    }
    Script.executeAbility = executeAbility;
    async function executeSpell(_spells, _friendly, _opponent, _targetsOverride) {
        if (!_spells)
            return;
        for (let spell of _spells) {
            let targets, side, positions;
            if (_targetsOverride) {
                targets = _targetsOverride;
            }
            else {
                ({ targets, side, positions } = Script.getTargets(spell.target, _friendly, _opponent, this));
            }
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_SPELL_BEFORE, trigger: spell, cause: this, target: this, detail: { targets, side, positions } });
            for (let target of targets) {
                await target.affect(spell, this);
            }
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_SPELL, trigger: spell, cause: this, target: this, detail: { targets, side, positions } });
        }
    }
    Script.executeSpell = executeSpell;
    async function executeAttack(_attacks, _friendly, _opponent, _targetsOverride) {
        if (!_attacks || _attacks.length === 0)
            return;
        for (let attack of _attacks) {
            let attackDmg = this.getDamageOfAttacks?.([attack], false) ?? attack.baseDamage;
            // get the target(s)
            let targets, side, positions;
            if (_targetsOverride) {
                targets = _targetsOverride;
            }
            else {
                ({ targets, side, positions } = Script.getTargets(attack.target, _friendly, _opponent, this));
            }
            await Promise.all(Script.EventBus.dispatchEventWithoutWaiting({ type: Script.EVENT.ENTITY_ATTACK, cause: this, target: this, trigger: attack, detail: { damage: attackDmg, targets, side, positions } }));
            for (let target of targets) {
                await target.damage(attackDmg, attack.baseCritChance, this);
            }
            await Script.EventBus.dispatchEvent({ type: Script.EVENT.ENTITY_ATTACKED, cause: this, target: this, trigger: attack, detail: { damage: attackDmg, targets, side, positions } });
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
    let ComponentChangeMaterial = (() => {
        var _a;
        let _classDecorators = [(_a = FudgeCore).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.ComponentScript;
        let _changeMaterial_decorators;
        let _changeMaterial_initializers = [];
        let _changeMaterial_extraInitializers = [];
        let _animationSprite_decorators;
        let _animationSprite_initializers = [];
        let _animationSprite_extraInitializers = [];
        var ComponentChangeMaterial = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _changeMaterial_decorators = [FudgeCore.serialize(FudgeCore.Material)];
                _animationSprite_decorators = [FudgeCore.serialize(FudgeCore.AnimationSprite)];
                __esDecorate(null, null, _changeMaterial_decorators, { kind: "field", name: "changeMaterial", static: false, private: false, access: { has: obj => "changeMaterial" in obj, get: obj => obj.changeMaterial, set: (obj, value) => { obj.changeMaterial = value; } }, metadata: _metadata }, _changeMaterial_initializers, _changeMaterial_extraInitializers);
                __esDecorate(null, null, _animationSprite_decorators, { kind: "field", name: "animationSprite", static: false, private: false, access: { has: obj => "animationSprite" in obj, get: obj => obj.animationSprite, set: (obj, value) => { obj.animationSprite = value; } }, metadata: _metadata }, _animationSprite_initializers, _animationSprite_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentChangeMaterial = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(ComponentChangeMaterial); }
            constructor() {
                super();
                this.changeMaterial = __runInitializers(this, _changeMaterial_initializers, null);
                this.animationSprite = (__runInitializers(this, _changeMaterial_extraInitializers), __runInitializers(this, _animationSprite_initializers, void 0));
                // Activate the functions of this component as response to events
                this.hndEvent = (__runInitializers(this, _animationSprite_extraInitializers), (_event) => {
                    switch (_event.type) {
                        case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                            break;
                        case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                            this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                            this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                            break;
                        case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                            this.switchMaterial();
                            break;
                    }
                });
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                // Listen to this component being added to or removed from a node
                this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
            }
            switchMaterial() {
                for (const node of this.node) {
                    if (node.getComponent(ƒ.ComponentMaterial) != null) {
                        node.getComponent(ƒ.ComponentMaterial).material = this.changeMaterial;
                        node.addComponent(new ƒ.ComponentAnimation(this.animationSprite));
                    }
                }
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentChangeMaterial = _classThis;
    })();
    Script.ComponentChangeMaterial = ComponentChangeMaterial;
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
            //#endregion
            //#region Run
            this.#lastStepWasShop = false;
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
        #lastStepWasShop;
        async runStep() {
            let encounter = await this.chooseNextEncounter();
            if (encounter < 0) { //shop
                Script.EventBus.dispatchEvent({ type: Script.EVENT.SHOP_OPEN });
                await Script.EventBus.awaitSpecificEvent(Script.EVENT.SHOP_CLOSE);
                this.#lastStepWasShop = true;
                return true;
            }
            let nextFight = await this.nextEncounter(encounter);
            this.#lastStepWasShop = false;
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
            const shopChance = this.#lastStepWasShop ? 0 : this.#shopChance[this.progress];
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
            // _difficulty = 10;
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
    var ƒ = FudgeCore;
    let SandSitter = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.Component;
        let _emerge_decorators;
        let _emerge_initializers = [];
        let _emerge_extraInitializers = [];
        let _emerged_idle_decorators;
        let _emerged_idle_initializers = [];
        let _emerged_idle_extraInitializers = [];
        var SandSitter = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _emerge_decorators = [ƒ.serialize(ƒ.Animation)];
                _emerged_idle_decorators = [ƒ.serialize(ƒ.Animation)];
                __esDecorate(null, null, _emerge_decorators, { kind: "field", name: "emerge", static: false, private: false, access: { has: obj => "emerge" in obj, get: obj => obj.emerge, set: (obj, value) => { obj.emerge = value; } }, metadata: _metadata }, _emerge_initializers, _emerge_extraInitializers);
                __esDecorate(null, null, _emerged_idle_decorators, { kind: "field", name: "emerged_idle", static: false, private: false, access: { has: obj => "emerged_idle" in obj, get: obj => obj.emerged_idle, set: (obj, value) => { obj.emerged_idle = value; } }, metadata: _metadata }, _emerged_idle_initializers, _emerged_idle_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                SandSitter = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            constructor() {
                super();
                this.emerge = __runInitializers(this, _emerge_initializers, void 0);
                this.emerged_idle = (__runInitializers(this, _emerge_extraInitializers), __runInitializers(this, _emerged_idle_initializers, void 0));
                this.burried = (__runInitializers(this, _emerged_idle_extraInitializers), false);
                this.buryNow = async (_ev) => {
                    this.burried = true;
                };
                this.emergeNow = async (_ev) => {
                    if (!this.burried)
                        return;
                    const vis = this.node.getParent();
                    if (!vis)
                        return;
                    vis.defaultAnimation = this.emerged_idle;
                    await vis.playAnimationIfPossible(this.emerge);
                    this.burried = false;
                };
                this.addEventListener("componentActivate" /* ƒ.EVENT.COMPONENT_ACTIVATE */, () => {
                    this.addEventListeners();
                }, { once: true });
            }
            addEventListeners() {
                Script.EventBus.addEventListener(Script.EVENT.FIGHT_START, this.buryNow);
                Script.EventBus.addEventListener(Script.EVENT.ROUND_END, this.emergeNow);
            }
        };
        return SandSitter = _classThis;
    })();
    Script.SandSitter = SandSitter;
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
                const entityVis = Script.Provider.visualizer.getEntity(entity);
                awayGrid.set(pos, entityVis, true);
            });
            this.away = new Script.VisualizeGrid(awayGrid, "away");
            let homeGrid = new Script.Grid();
            _fight.arena.home.forEachElement((entity, pos) => {
                const entityVis = Script.Provider.visualizer.getEntity(entity);
                homeGrid.set(pos, entityVis, true);
            });
            this.home = new Script.VisualizeGrid(homeGrid, "home");
            Script.Provider.visualizer.addToScene(this.away);
            Script.Provider.visualizer.addToScene(this.home);
            // Provider.visualizer.drawScene();
            this.addEventListeners();
        }
        async nukeGrid() {
            this.home.nuke();
            this.away.nuke();
        }
        async fightStart() {
            console.log("Fight Start!");
            this.home.grid.forEachElement(el => el.addEventListeners());
            this.away.grid.forEachElement(el => el.addEventListeners());
        }
        async roundStart() {
            console.log("Round Start!");
        }
        async roundEnd() {
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
                this.home.removeEntityFromGrid(pos);
            pos = this.away.grid.findElementPosition(entityVis);
            if (pos)
                this.away.removeEntityFromGrid(pos);
        }
        whereIsEntity(_entity) {
            let found = false;
            this.home.grid.forEachElement((el) => { if (el === _entity)
                found = true; });
            if (found)
                return this.home;
            this.away.grid.forEachElement((el) => { if (el === _entity)
                found = true; });
            if (found)
                return this.away;
            return undefined;
        }
        addEventListeners() {
            this.#listeners.set(Script.EVENT.FIGHT_PREPARE_COMPLETED, this.fightStart);
            this.#listeners.set(Script.EVENT.FIGHT_ENDED, this.fightEnd);
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
    class VisualizeBench extends ƒ.Component {
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        #entities = new Set();
        addEntity(_entity) {
            this.#entities.add(_entity);
            this.arrangeEntities();
            this.node.addChild(_entity);
            _entity.activate(true);
        }
        hasEntity(_entity) {
            return this.#entities.has(_entity);
        }
        removeEntity(_entity) {
            this.#entities.delete(_entity);
            this.arrangeEntities();
            this.node.removeChild(_entity);
            _entity.activate(false);
        }
        clear() {
            const arr = Array.from(this.#entities);
            for (let entity of arr) {
                this.removeEntity(entity);
            }
        }
        arrangeEntities() {
            const distanceBetweenEntities = 1;
            const arr = Array.from(this.#entities);
            for (let i = 0; i < arr.length; i++) {
                const entity = arr[i];
                const newX = (i - (arr.length - 1) / 2) * distanceBetweenEntities;
                entity.mtxLocal.translation = new ƒ.Vector3(newX);
            }
        }
    }
    Script.VisualizeBench = VisualizeBench;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    // export interface VisualizeEntity {
    //     //idle(): Promise<void>;
    //     attack(_ev: FightEvent): Promise<void>;
    //     move(_move: MoveData): Promise<void>;
    //     getHurt(_ev: FightEvent): Promise<void>;
    //     resist(): Promise<void>;
    //     useSpell(_ev: FightEvent): Promise<void>;
    //     showPreview(): Promise<void>;
    //     hidePreview(): Promise<void>;
    //     /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
    //     updateVisuals(): void;
    // }
    class VisualizeEntity extends ƒ.Node /*implements VisualizeEntity*/ {
        constructor(_entity) {
            super("entity");
            this.updateTmpText = () => {
                if (!this.tmpText)
                    return;
                let effectObjects = [];
                let index = 0;
                this.entity.activeEffects.forEach((value, type) => {
                    if (value <= 0)
                        return;
                    effectObjects.push(Script.createElementAdvanced("img", { attributes: [["src", `./Assets/UIElemente/InGameUI/${VisualizeEntity.typeToName.get(type)}`], ["alt", type], ["style", `--index: ${index++}`]] }));
                });
                effectObjects.push(Script.createElementAdvanced("div", { innerHTML: `<span>${this.entity.currentHealth} / ${this.entity.health}</span>` }));
                this.tmpText.replaceChildren(...effectObjects);
                const pos = Script.viewport.pointWorldToClient(ƒ.Vector3.SUM(this.mtxWorld.translation, ƒ.Vector3.Z(0.4)));
                this.tmpTextWrapper.style.left = pos.x + "px";
                this.tmpTextWrapper.style.top = pos.y + "px";
                this.textUpdater = requestAnimationFrame(this.updateTmpText);
            };
            // textUpdater: number;
            this.addText = () => {
                document.getElementById("GameOverlayInfos").appendChild(this.tmpTextWrapper);
                requestAnimationFrame(this.updateTmpText);
            };
            this.removeText = () => {
                this.tmpTextWrapper.remove();
                cancelAnimationFrame(this.textUpdater);
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
            this.tmpText = Script.createElementAdvanced("div", { classes: ["EntityOverlayInner"], innerHTML: "<span></span>" });
            this.tmpTextWrapper = Script.createElementAdvanced("div", { classes: ["EntityOverlay"] });
            this.tmpTextWrapper.appendChild(this.tmpText);
            this.updateTmpText();
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.scaling = ƒ.Vector3.ONE(1.0);
            this.cmpAudio = new Script.ComponentAudioMixed(undefined, false, false, undefined, Script.AUDIO_CHANNEL.SOUNDS);
            this.addComponent(this.cmpAudio);
            this.addEventListener("nodeActivate" /* ƒ.EVENT.NODE_ACTIVATE */, this.addText);
            this.addEventListener("nodeDeactivate" /* ƒ.EVENT.NODE_DEACTIVATE */, this.removeText);
            Script.EventBus.addEventListener(Script.EVENT.RUN_END, this.eventListener);
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
            console.log("entity visualizer: move", { entity: _ev.detail.entity, oldPosition: _ev.detail.oldPosition, position: _ev.detail.position, direction: _ev.detail.direction, step: _ev.detail.step });
            await this.playAnimationIfPossible(Script.ANIMATION.MOVE);
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
            const pick = new Script.PickSphere();
            pick.radius = 0.5;
            this.addComponent(pick);
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
            let animation;
            let audio;
            if (typeof _anim === "string") {
                if (!this.cmpAnimation)
                    return this.showFallbackText(_anim);
                animation = Script.AnimationLink.linkedAnimations.get(this.entity.id)?.get(_anim);
                if (!animation && this.entity.id.includes("Eumling"))
                    animation = Script.AnimationLink.linkedAnimations.get("defaultEumling")?.get(_anim);
                if (!animation)
                    return this.showFallbackText(_anim);
                audio = Script.chooseRandomElementsFromArray(Script.AnimationLink.linkedAudio.get(this.entity.id)?.get(_anim), 1)[0];
                if (!audio && this.entity.id.includes("Eumling"))
                    audio = Script.chooseRandomElementsFromArray(Script.AnimationLink.linkedAudio.get("defaultEumling")?.get(_anim), 1)[0];
            }
            else {
                animation = _anim;
            }
            this.cmpAnimation.animation = animation;
            this.cmpAnimation.time = 0;
            if (audio) {
                this.cmpAudio.setAudio(audio);
                this.cmpAudio.play(true);
                this.cmpAudio.loop = false;
            }
            // console.log({ totalTime: animation.totalTime });
            await Script.waitMS(animation.totalTime);
            this.cmpAudio.play(false);
            this.cmpAnimation.animation = this.defaultAnimation; // TODO: check if we should instead default back to idle or nothing at all
            audio = Script.chooseRandomElementsFromArray(Script.AnimationLink.linkedAudio.get(this.entity.id)?.get(Script.ANIMATION.IDLE), 1)[0];
            if (!audio && this.entity.id.includes("Eumling"))
                audio = Script.chooseRandomElementsFromArray(Script.AnimationLink.linkedAudio.get("defaultEumling")?.get(Script.ANIMATION.IDLE), 1)[0];
            if (audio) {
                this.cmpAudio.setAudio(audio);
                this.cmpAudio.play(true);
                this.cmpAudio.loop = true;
            }
        }
        async showFallbackText(_text) {
            let node = await Script.getCloneNodeFromRegistry(_text);
            if (node)
                this.addChild(node);
            await Script.waitMS(1000);
            if (node)
                this.removeChild(node);
        }
        static { this.typeToName = new Map([
            [Script.SPELL_TYPE.SHIELD, "IconDefenseUp.png"],
            [Script.SPELL_TYPE.MIRROR, "IconSpiegel.png"],
            [Script.SPELL_TYPE.THORNS, "IconDornen.png"],
            [Script.SPELL_TYPE.VULNERABLE, "IconDefenseDown.png"],
            [Script.SPELL_TYPE.SHIELD, "IconDefenseUp.png"],
            [Script.SPELL_TYPE.STUN, "IconStun.png"],
            [Script.SPELL_TYPE.UNTARGETABLE, "IconUntargetable.png"],
        ]); }
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
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_MOVE, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.EUMLING_LEVELUP, this.updateTmpText);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_ATTACK, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_HURT, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_SPELL_BEFORE, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_AFFECTED, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_DIES, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_MOVE, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_HURT, this.updateTmpText);
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_AFFECTED, this.updateTmpText);
            Script.EventBus.removeEventListener(Script.EVENT.ROUND_END, this.updateTmpText);
            Script.EventBus.removeEventListener(Script.EVENT.ROUND_START, this.updateTmpText);
            Script.EventBus.removeEventListener(Script.EVENT.EUMLING_LEVELUP, this.updateTmpText);
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
                        this.removeEventListener("nodeActivate" /* ƒ.EVENT.NODE_ACTIVATE */, this.addText);
                        this.removeEventListener("nodeDeactivate" /* ƒ.EVENT.NODE_DEACTIVATE */, this.removeText);
                        Script.EventBus.removeEventListener(Script.EVENT.RUN_END, this.eventListener);
                        break;
                    }
                }
            }
            this.updateTmpText();
        }
    }
    Script.VisualizeEntity = VisualizeEntity;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class VisualizeVFX {
        constructor(_node, _id, _delay = 0) {
            this.delay = 0;
            this.node = _node;
            this.anim = this.findFirstAnimComp(this.node);
            this.id = _id;
            this.delay = _delay;
            this.deactivate();
        }
        async addToAndActivate(_parent) {
            _parent.addChild(this.node);
            return this.activate();
        }
        async activate() {
            this.node?.activate(true);
            if (this.anim) {
                this.anim.jumpTo(0);
                return new Promise((resolve) => {
                    ƒ.Time.game.setTimer(this.delay * 1000, 1, () => {
                        this.anim.jumpTo(0);
                        this.anim.playmode = ƒ.ANIMATION_PLAYMODE.PLAY_ONCE;
                    });
                    ƒ.Time.game.setTimer(this.delay * 1000 + this.anim.animation.totalTime, 1, () => {
                        resolve();
                    });
                });
            }
        }
        removeAndDeactivate() {
            this.node?.getParent()?.removeChild(this.node);
            this.deactivate();
        }
        deactivate() {
            this.node?.activate(false);
            if (this.anim) {
                this.anim.playmode = ƒ.ANIMATION_PLAYMODE.STOP;
            }
        }
        findFirstAnimComp(_node) {
            const nodesToCheck = [_node];
            while (nodesToCheck.length > 0) {
                const node = nodesToCheck.shift();
                let cmp = node.getComponent(ƒ.ComponentAnimation);
                if (cmp)
                    return cmp;
                nodesToCheck.push(...node.getChildren());
            }
            return undefined;
        }
    }
    Script.VisualizeVFX = VisualizeVFX;
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
                this.removeEntityFromGrid(_pos);
            }
            // remove this entity if it's already somewhere in the grid
            this.grid.forEachElement((entity, pos) => {
                if (entity === _entity)
                    this.removeEntityFromGrid(pos);
            });
            if (!_anchor) {
                /**Anchors are named from 0-8 */
                _anchor = this.getAnchor(_pos[0], _pos[1]);
            }
            //get the Positions from the placeholders and translate the entities to it
            this.moveEntityToAnchor(_entity, _pos);
            this.addChild(_entity);
            this.grid.set(_pos, _entity, true);
            _entity.activate(true);
        }
        removeEntityFromGrid(_pos) {
            if (Script.Grid.outOfBounds(_pos))
                return;
            let elementToRemove = this.grid.get(_pos);
            if (!elementToRemove)
                return;
            this.grid.remove(_pos);
            this.removeChild(elementToRemove);
            elementToRemove.activate(false);
        }
        async moveEntityToAnchor(_entity, position, _timeMS = 0) {
            let _anchor = this.getAnchor(position[0], position[1]);
            //get the Positions from the placeholders and translate the entity to it
            let pos3 = _anchor.mtxLocal.translation;
            this.grid.set(position, _entity, true);
            await Script.moveNodeOverTime(_entity, pos3, _entity.mtxLocal.rotation, _timeMS);
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
                _el.activate(false);
                _el.removeEventListeners();
                this.removeEntityFromGrid(pos);
            });
        }
        async move(_ev) {
            //gets the moving entity and moves it
            const visEntity = Script.Provider.visualizer.getEntity(_ev.cause);
            if (this.grid.findElementPosition(visEntity))
                await this.moveEntityToAnchor(visEntity, _ev.detail.position, 1000);
        }
        registerEventListeners() {
            Script.EventBus.addEventListener(Script.EVENT.ENTITY_MOVE, this.eventListener);
            Script.EventBus.addEventListener(Script.EVENT.RUN_END, this.eventListener);
        }
        removeEventListeners() {
            Script.EventBus.removeEventListener(Script.EVENT.ENTITY_MOVE, this.eventListener);
            Script.EventBus.removeEventListener(Script.EVENT.RUN_END, this.eventListener);
        }
        async handleEvent(_ev) {
            switch (_ev.type) {
                case Script.EVENT.ENTITY_MOVE: {
                    await this.move(_ev);
                    break;
                }
                case Script.EVENT.RUN_END: {
                    this.removeEventListeners();
                }
            }
        }
    }
    Script.VisualizeGrid = VisualizeGrid;
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
    class GoldDisplayElement extends Script.UIElement {
        static #element = Script.createElementAdvanced("div", {
            classes: ["GoldDisplay"],
            innerHTML: "0",
        });
        static { this.instance = new GoldDisplayElement(); }
        constructor() {
            super();
            this.update = (_ev) => {
                GoldDisplayElement.#element.innerText = Script.Run.currentRun.gold.toString();
            };
            this.addEventListeners();
        }
        static get element() {
            return this.#element;
        }
        addEventListeners() {
            // TODO: when to remove these listeners?
            Script.EventBus.addEventListener(Script.EVENT.GOLD_CHANGE, this.update);
        }
    }
    Script.GoldDisplayElement = GoldDisplayElement;
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
                this.#element.dataset.level = this.#stone.level.toString();
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
                attributes: [["style", `--stone-url: url("./Assets/UIElemente/Stones/${this.#stone.id}.png")`]]
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