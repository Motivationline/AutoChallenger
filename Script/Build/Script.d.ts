declare namespace Script {
    enum DIRECTION_RELATIVE {
        FORWARD = 0,
        BACKWARD = 1,
        LEFT = 2,
        RIGHT = 3
    }
    interface Move {
        /** rotates the unit _clockwise_ by 45° per increment of this value.
         * **rotation occurs before movement** and is entirely mechanical, not visual.
         */
        rotateBy?: number;
        direction: DIRECTION_RELATIVE;
        distance: number;
    }
    interface Moves {
        moves: Move[];
        selection: Selection;
    }
}
declare namespace Script {
    export enum SELECTION_ORDER {
        /** Selects options in order, loops around when found */
        SEQUENTIAL = 1,
        /** Chooses random options for the entire fight */
        RANDOM_EACH_FIGHT = 2,
        /** Chooses random options for each round */
        RANDOM_EACH_ROUND = 3,
        /** Chooses all options, always starting from the first */
        ALL = 4
    }
    export interface Selection {
        order: SELECTION_ORDER;
        /** how many should be selected. Leave blank or 0 to select all. */
        amount?: number;
    }
    export enum AREA_SHAPE_PATTERN {
        /** Choose your own pattern */
        PATTERN = 99
    }
    export enum AREA_SHAPE_OTHERS {
        /** Target a single Slot */
        SINGLE = 1,
        /** Target an entire row */
        ROW = 2,
        /** Target an entire column */
        COLUMN = 3,
        /** Target enemies in a plus shape, so basically column + row */
        PLUS = 4,
        /** Target enemies in an X shape, so all the corners but not the center */
        DIAGONALS = 5,
        /** Target all enemies except in the center position */
        SQUARE = 6
    }
    export const AREA_SHAPE: typeof AREA_SHAPE_PATTERN & typeof AREA_SHAPE_OTHERS;
    export enum AREA_POSITION_ABSOLUTE {
        /** Choose a fixed position */
        ABSOLUTE = "absolute"
    }
    export enum AREA_POSITION_RELATIVE {
        /** Selects first (from center) in the same row */
        RELATIVE_FIRST_IN_ROW = "relativeFirstInRow",
        /** Selects last (from center) in the same row */
        RELATIVE_LAST_IN_ROW = "relativeLastInRow",
        /** Selects the same spot, so top left -> top left */
        RELATIVE_SAME = "relativeSame",
        /** Selects the same spot but mirrored, so top left -> top right*/
        RELATIVE_MIRRORED = "relativeMirrored"
    }
    export const AREA_POSITION: typeof AREA_POSITION_ABSOLUTE & typeof AREA_POSITION_RELATIVE;
    type AreaRelative = {
        /** ## Option 1: Choose a position relative to the executors position */
        position: AREA_POSITION_RELATIVE;
    };
    type AreaAbsolute = {
        /** ## Option 2: Choose a fixed position
         * **requires `absolutePosition` attribute**
         */
        position: AREA_POSITION_ABSOLUTE;
        /** zero-indexed position in the grid to place the **center** of the targeting. */
        absolutePosition: Position;
    };
    type AreaPositioned = (AreaRelative | AreaAbsolute);
    type AreaTargetPattern = {
        /** ### Option 2: Choose your own pattern.
         * **requires `pattern` attribute.** */
        shape: AREA_SHAPE_PATTERN;
        /** Draw your own pattern. Needs to be 3x3 and filled like this:
         * - falsy for "no attack" (e.g. `0`, `false`, `""`, `null`, `undefined` or just empty)
         * - truthy for "attack" (e.g. `1`, `true`, `"X"`)
         *
         * ### examples
         * ```
         * [[0, 1, 0],
         *   [1, 0, 1],
         *   [0, 1, 0]]
         * [["", "X", ""],
         *   ["X", "", "X"],
         *   ["", "X", ""]]
         * [[false, true, false],
         *   [true, false, true],
         *   [false, true, false]]
         * // you can mix and match
         * [[0, 1, 0],
         *   ["X", "", "X"],
         *   [false, true, false]]
         * // undefined aka leaving empty is also valid (though notice the extra , at the end)
         * [[,1,,], // => [undefined, 1, undefined,]
         *   [1,,1], // => [1, undefined, 1]
         *   [,1,,]] // => [undefined, 1, undefined,]
         * // smallest valid empty pattern
         * [[,,,],[,,,],[,,,]]
         * ```
         */
        pattern: Grid<any>;
    };
    type AreaTargetOthers = {
        /** ### Option 1: Choose one of the predefined shapes */
        shape: AREA_SHAPE_OTHERS;
    };
    type AreaTarget = AreaTargetOthers | AreaTargetPattern;
    /**
     * Defines the area that something is supposed to happen in. Requires the following attributes:
     *
     * - position: AREA_POSITION
     *   - absolutePosition: Position _only if `position === ABSOLUTE`_
     * - shape **or** shape**s**
     *   - shape: AREA_SHAPE
     *     - pattern: string[][] _only if `target === PATTERN`_
     *   - shape**s**: Array of target Objects
     *     - order: AREA_SHAPE_ORDER
     */
    type Area = AreaTarget & AreaPositioned;
    export enum TARGET_SIDE {
        /** Your own side */
        ALLY = 1,
        /** Your opponents side */
        OPPONENT = 2
    }
    type TargetBase = {
        /** Which side to target on, your own or the opponents */
        side: TARGET_SIDE;
        /** Whether to exclude yourself from the targeting options. _default: `false`_ */
        excludeSelf?: boolean;
    };
    type TargetArea = {
        /** What area of the selected side should be targeted */
        area: Area;
    };
    export enum TARGET_SORT {
        /** Whatever order they happen to be in memory in */
        ARBITRARY = "arbitrary",
        /** randomize order */
        RANDOM = "random",
        /** order by attack / damage (highest first) */
        STRONGEST = "strongest",
        /** order by health (highest first) */
        HEALTHIEST = "healthiest"
    }
    type TargetEntity = {
        /** Select an entity from the chosen side */
        entity: {
            /** In which order should the entities be processed?
             *
             * - `arbitrary` (default): Whatever order they happen to be in memory in
             * - `random`: randomize their order
             * - `strongest`: order by attack / damage (highest first)
             * - `healthiest`: order by health (highest first)
            */
            sortBy?: TARGET_SORT;
            /** If true, reverses the selection order */
            reverse?: boolean;
            /** How many targets should at most be targeted? Leave empty for "all" */
            maxNumTargets?: number;
        };
    };
    export type TargetTarget = TargetArea | TargetEntity;
    export type Target = TargetBase & TargetTarget;
    export namespace TARGET {
        const SELF: Readonly<Target>;
        const FIRST_ENEMY_SAME_ROW: Readonly<Target>;
        const RANDOM_ENEMY: Readonly<Target>;
        const RANDOM_ALLY: Readonly<Target>;
    }
    export function getTargets(_target: Target, _allies: Grid<iEntity>, _opponents: Grid<iEntity>, _self?: iEntity): iEntity[];
    export {};
}
declare namespace Script {
    enum SPELL_TYPE {
        /** Blocks 1 damage per shield, destroyed after */
        SHIELD = 0,
        /** Reflects damage back to attacker once, shields from damage. */
        MIRROR = 1,
        /** Doubles damage of next attack, destroyed after. Max 1 used per attack. */
        STRENGTH = 2,
        /** Deals 1 damage to attacker once, destroyed after. */
        THORNS = 3,
        /** Takes double damage from next attack. Max 1 used per attack */
        VULNERABLE = 4,
        /** Next attack doesn't deal any damage. Max 1 used per attack */
        WEAKNESS = 5,
        /** Deals 1 damage at the end of the round per poison stack. Removes 1 per round. */
        POISON = 6,
        /** Deals 1 damage at the end of the round. Removes 1 per round. */
        FIRE = 7,
        GOLD = 8
    }
    interface SpellNoTarget {
        type: SPELL_TYPE;
        /** Strength of the spell. Default: 1 */
        level?: number;
    }
    interface Spell extends SpellNoTarget {
        target: Target;
    }
    interface Spells {
        spells: Spell[];
        selection: Selection;
    }
}
declare namespace Script {
    type Grid<T> = [[T, T, T], [T, T, T], [T, T, T]];
    /**
     * ```
     * [0, 0] [1, 0] [2, 0]
     * [0, 1] [1, 1] [2, 1]
     * [0, 2] [1, 2] [2, 2]
     * ```
     */
    type Position = [number, number];
    enum EVENT {
        FIGHT_PREPARE = "fightPrepare",
        FIGHT_PREPARE_COMPLETED = "fightPrepareCompleted",
        FIGHT_START = "fightStart",
        FIGHT_END = "fightEnd",
        ROUND_START = "roundStart",
        ROUND_END = "roundEnd",
        ENTITY_ATTACK = "entityAttack",
        ENTITY_ATTACKED = "entityAttacked",
        ENTITY_HEAL = "entityHeal",
        ENTITY_HEALED = "entityHealed",
        ENTITY_HURT_BEFORE = "entityHurtBefore",
        ENTITY_HURT = "entityHurt",
        ENTITY_DIES = "entityDies",
        ENTITY_DIED = "entityDied",
        ENTITY_CREATE = "entityCreate",
        ENTITY_CREATED = "entityCreated",
        ENTITY_MOVE = "entityMove",
        ENTITY_MOVED = "entityMoved",
        TRIGGERED_ABILITY = "triggeredAbility"
    }
    /**
     * There are a lot of callbacks / events that things inside the game can hook into to do something at a specific point in time.
     * We're using a custom system to be able to `await` the Event results to allow for a nice visual sequence to occur.
     *
     *
     */
    interface FightEvent {
        /** What kind of event happened? */
        type: EVENT;
        /** Who sent this event? */
        target: iEntity;
        /** Who or what caused the event? Might be empty. */
        cause?: iEntity;
        /** Optional value field for relevant events. Might be empty. */
        value?: number;
        /** Optional value for whatever triggered this event. */
        trigger?: Attack | Spell | Move;
    }
    interface iFight {
        /** How many rounds this fight should take until it's considered "passed" even if not all enemies are defeated. */
        rounds: number;
        /** Use the string identifiers from the entities to define what goes where. */
        entities: Grid<string>;
    }
    interface Arena {
        home: Grid<iEntity>;
        away: Grid<iEntity>;
    }
}
declare namespace Script {
    namespace DataContent {
        const entities: IEntityData[];
    }
}
declare namespace Script {
    namespace DataContent {
        const fights: iFight[];
    }
}
declare namespace Script {
    interface iData {
        fights: iFight[];
        entities: IEntityData[];
        entityMap: {
            [id: string]: IEntityData;
        };
    }
    class Data {
        private data;
        load(): Promise<void>;
        get fights(): readonly iFight[];
        get entities(): readonly IEntityData[];
        getEntity(_id: string): Readonly<IEntityData> | undefined;
        private resolveParent;
    }
}
declare namespace Script {
    class Fight {
        rounds: number;
        arena: Arena;
        constructor(_fight: iFight);
    }
}
declare namespace Script {
    interface IVisualizer {
        getEntity(_entity: iEntity): IVisualizeEntity;
    }
    class VisualizerNull implements IVisualizer {
        getEntity(_entity: iEntity): IVisualizeEntity;
    }
}
declare namespace Script {
    class Provider {
        #private;
        static get data(): Readonly<Data>;
        static get visualizer(): Readonly<IVisualizer>;
        static setVisualizer(_vis: IVisualizer): void;
    }
}
declare namespace Script {
}
declare namespace Script {
    interface IEntityData {
        id: string;
        parent?: string;
        /** The amount of health the entity starts with. _Default: 1_ */
        health?: number;
        /**
         * The direction the entity should be oriented in when spawned.
         * 0 = 8 = towards opponents, 2 = up, 4 = away from opponents, 6 = down
         * Default: 0
         */
        startDirection?: number;
        moves?: Moves | Move;
        spells?: Spells | Spell;
        attacks?: Attacks | Attack;
        /** Modifiers to protect against Spells. It's a multiplier.
         *
         * 0 => no effect
         * 0.5 => half as powerful
         * 1 => normal
         * 2 => twice as powerful
        */
        resistances?: [SPELL_TYPE, number][];
        abilities?: iAbility[];
    }
    interface iEntity extends IEntityData {
        currentHealth: number;
        position: Position;
        move(): Promise<void>;
        useSpell(_arena: Arena): Promise<void>;
        useAttack(_arena: Arena): Promise<void>;
        getDamage(): number;
        updateVisuals(): void;
    }
    class Entity implements iEntity {
        #private;
        currentHealth: number;
        position: Position;
        id: string;
        parent?: string;
        health?: number;
        moves?: Moves;
        spells?: Spells;
        attacks?: Attacks;
        resistances?: [SPELL_TYPE, number][];
        startDirection?: number;
        constructor(_entity: IEntityData, _vis: IVisualizer);
        getDamage(): number;
        useSpell(_arena: Arena): Promise<void>;
        useAttack(_arena: Arena): Promise<void>;
        move(): Promise<void>;
        updateVisuals(): void;
    }
}
declare namespace Script {
    interface AbilityCondition {
        /** Is this entity targeted by this?*/
        target?: Target;
        /** Is this entity the cause of this? */
        cause?: Target;
        value?: number | {
            min?: number;
            max?: number;
        };
        /** placeholder for other stuff, like testing whether it's a crit or not. Not sure how it's supposed to be implemented yet. */
        otherOptions?: any;
    }
    interface iAbility {
        /** When should this ability happen? */
        on: EVENT[] | EVENT;
        /** Single condition or a list of conditions that need to be met for this ability to trigger.
         * Leave empty to always trigger.
         */
        conditions?: AbilityCondition[] | AbilityCondition;
        /** What conditions need to be met for this to happen?
         * The outer Array is combined using OR, the inner array is combined using AND.
         *
         * `[["condition1" AND "condition2"] OR ["condition1" AND "condition3"]]`
         *
         * By default, all conditions are required to be met.
        */
        /** Who should be targeted with this ability? */
        target: "target" | "cause" | Target;
        attack?: AttackNoTarget;
        spell?: SpellNoTarget;
    }
}
declare namespace Script {
    interface AttackNoTarget {
        baseDamage: number;
        /** default: 0 */
        baseCritChance?: number;
    }
    interface Attack extends AttackNoTarget {
        target: Target;
    }
    interface Attacks {
        attacks: Attack[];
        selection: Selection;
    }
}
declare namespace Script {
}
declare namespace Script {
    namespace Utils {
        function forEachElement<T>(_grid: Grid<T>, callback: (element?: T, pos?: Position) => void): void;
        function forEachElementAsync<T>(_grid: Grid<T>, callback: (element?: T, pos?: Position) => Promise<void>): Promise<void>;
    }
    namespace Grid {
        function EMPTY<T>(): Grid<T | undefined>;
    }
    function waitMS(_ms: number): Promise<void>;
}
declare namespace Script {
    interface IVisualizeEntity {
        attack(_attack: Attack): Promise<void>;
        move(): Promise<void>;
        hurt(): Promise<void>;
        spell(_spell: Spell): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): Promise<void>;
    }
    class VisualizeEntityNull implements IVisualizeEntity {
        #private;
        constructor(_entity: iEntity);
        attack(): Promise<void>;
        move(): Promise<void>;
        hurt(): Promise<void>;
        spell(): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        updateVisuals(): Promise<void>;
    }
}
declare namespace Script {
    interface IVisualizeGrid {
        getRealPosition(_pos: Position): any;
        updateVisuals(): void;
    }
    class VisualizeGridNull implements IVisualizeGrid {
        #private;
        constructor(_grid: Grid<iEntity>);
        updateVisuals(): void;
        getRealPosition(_pos: Position): Position;
    }
}
