"use strict";
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
                    pos = [_self.position[0], 2 - _self.position[1]];
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
            side.forEachElement((el) => {
                if (!el)
                    return;
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
var Script;
(function (Script) {
    //#endregion
    //#region Events
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
    //#endregion
    //#region Fight
    //#endregion
    // interface RunManager {
    //     eumlinge: Eumling, // iEntity / Entity implementation
    //     previousFights: iFight[],
    //     currentFight: Fight,
    //     // map?: any, // needs to come from somewhere
    //     progress: number,
    //     // a region or something: any
    //     // relicts: Relict[]
    // }
})(Script || (Script = {}));
/// <reference path="../Fight/Move.ts" />
/// <reference path="../Fight/Target.ts" />
/// <reference path="../Fight/Spell.ts" />
/// <reference path="../Misc/Types.ts" />
var Script;
/// <reference path="../Fight/Move.ts" />
/// <reference path="../Fight/Target.ts" />
/// <reference path="../Fight/Spell.ts" />
/// <reference path="../Misc/Types.ts" />
(function (Script) {
    let DataContent;
    (function (DataContent) {
        DataContent.entities = [
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
                        order: Script.SELECTION_ORDER.ALL,
                        amount: 1,
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
                    [Script.SPELL_TYPE.FIRE, 0], // fully resistant to fire
                    [Script.SPELL_TYPE.POISON, 2], // double damage from poison
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
                            baseDamage: 6,
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
                rounds: 3,
                entities: [[, , ,], [, "attackRandomEnemy", ,], [, , ,]],
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
        }
        async run() {
            // TODO: add eventlisteners
            // run actual round
            for (let r = 0; r < this.rounds; r++) {
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                // check if round is over
                if (this.arena.home.occupiedSpots === 0) {
                    return console.log("Player lost");
                }
                if (this.arena.away.occupiedSpots === 0) {
                    return console.log("Player won");
                }
            }
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
            return new Script.VisualizeEntityNull(_entity);
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
    initProvider();
    async function initProvider() {
        await Script.Provider.data.load();
        //TODO load correct visualizer here
        run();
    }
    function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function run() {
        let eumlings = new Script.Grid();
        eumlings.set([1, 1], new Script.Entity(Script.Provider.data.getEntity("multipleAttacksOnlyOnePerRound"), Script.Provider.visualizer));
        let fightData = Script.Provider.data.fights[0];
        let fight = new Script.Fight(fightData, eumlings);
        await fight.run();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Entity {
        constructor(_entity, _vis) {
            this.id = _entity.id;
            this.health = _entity.health ?? 1;
            this.currentHealth = this.health;
            // this.moves = _entity.moves instanceof ;
            if (_entity.moves)
                this.moves = "selection" in _entity.moves ? _entity.moves : { options: [_entity.moves], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.spells)
                this.spells = "selection" in _entity.spells ? _entity.spells : { options: [_entity.spells], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            if (_entity.attacks)
                this.attacks = "selection" in _entity.attacks ? _entity.attacks : { options: [_entity.attacks], selection: { order: Script.SELECTION_ORDER.ALL, amount: 1 } };
            this.visualizer = _vis.getEntity(this);
        }
        damage(_amt) {
            throw new Error("Method not implemented.");
        }
        async move() {
            ;
        }
        async useSpell(_friendly, _opponent) {
            const spells = this.select(this.spells);
            for (let spell of spells) {
                await this.visualizer.spell(spell);
            }
        }
        async useAttack(_friendly, _opponent) {
            const attacks = this.select(this.attacks);
            for (let attack of attacks) {
                // get the target(s)
                let target = Script.getTargets(attack.target, _friendly, _opponent);
                // execute the attacks
                await this.visualizer.attack(attack);
            }
        }
        getOwnDamage() {
            throw new Error("Method not implemented.");
        }
        updateVisuals() {
            // 
        }
        select(_options) {
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
    }
    Script.Entity = Entity;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Grid {
        constructor(_content = Grid.EMPTY()) {
            this.grid = _content;
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
            callback(this.grid[0][0], [0, 0]);
            callback(this.grid[1][0], [1, 0]);
            callback(this.grid[2][0], [2, 0]);
            callback(this.grid[0][1], [0, 1]);
            callback(this.grid[1][1], [1, 1]);
            callback(this.grid[2][1], [2, 1]);
            callback(this.grid[0][2], [0, 2]);
            callback(this.grid[1][2], [1, 2]);
            callback(this.grid[2][2], [2, 2]);
        }
        async forEachElementAsync(callback) {
            await callback(this.grid[0][0], [0, 0]);
            await callback(this.grid[1][0], [1, 0]);
            await callback(this.grid[2][0], [2, 0]);
            await callback(this.grid[0][1], [0, 1]);
            await callback(this.grid[1][1], [1, 1]);
            await callback(this.grid[2][1], [2, 1]);
            await callback(this.grid[0][2], [0, 2]);
            await callback(this.grid[1][2], [1, 2]);
            await callback(this.grid[2][2], [2, 2]);
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
            newGrid.set(pos, new _entity(entityData, Script.Provider.visualizer));
        });
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
    class VisualizeEntityNull {
        #entity;
        constructor(_entity) { this.#entity = _entity; }
        async attack(_attack) {
            console.log("entity visualizer null: attack", _attack);
            await Script.waitMS(200);
        }
        async move(_move) {
            console.log("entity visualizer null: move", _move);
            await Script.waitMS(200);
        }
        async hurt() {
            console.log("entity visualizer null: hurt", this.#entity);
            await Script.waitMS(200);
        }
        async spell(_spell) {
            console.log("entity visualizer null: spell", _spell);
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
            console.log("entity visualizer null: updateVisuals", this.#entity);
            await Script.waitMS(200);
        }
    }
    Script.VisualizeEntityNull = VisualizeEntityNull;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class VisualizeGridNull {
        #grid;
        constructor(_grid) {
            this.#grid = _grid;
        }
        updateVisuals() {
            this.#grid.forEachElement((element) => {
                element.updateVisuals();
            });
        }
        getRealPosition(_pos) {
            return _pos;
        }
    }
    Script.VisualizeGridNull = VisualizeGridNull;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map