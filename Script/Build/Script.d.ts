declare namespace Script {
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
        /** Who sent this event? undefined if system */
        target?: IEntity;
        /** Who or what caused the event? Might be empty. */
        cause?: IEntity;
        /** Optional value field for relevant events. Might be empty. */
        value?: number;
        /** Optional value for whatever triggered this event. */
        trigger?: AttackData | SpellData | MoveData;
    }
    type FightEventListener = (_ev?: FightEvent) => Promise<void>;
    class EventBus {
        static listeners: Map<EVENT, FightEventListener[]>;
        static removeAllEventListeners(): void;
        static addEventListener(_ev: EVENT, _fn: FightEventListener): void;
        static removeEventListener(_ev: EVENT, _fn: FightEventListener): void;
        static dispatchEvent(_ev: FightEvent): Promise<void>;
    }
}
declare namespace Script {
    enum DIRECTION_RELATIVE {
        FORWARD = "forward",
        BACKWARD = "backward",
        LEFT = "left",
        RIGHT = "right"
    }
    interface MoveData {
        /** rotates the unit _clockwise_ by 45° per increment of this value.
         * **rotation occurs before movement** and is entirely mechanical, not visual.
         */
        rotateBy?: number;
        direction: DIRECTION_RELATIVE;
        distance: number;
        /** If this unit is blocked from moving in the desired direction, what should it do? */
        blocked?: {
            /** how many increments of 45° should it rotate _(clockwise)_ to try again? */
            rotateBy: number;
            /** How many attempts should it make to rotate and move again? default: 1, max 8 */
            attempts?: number;
        };
    }
    /**Move the Entity based of the Grid Data then map the position to the empty nodes in the Graph with a mapping function
     * this could also be done in the Visualizer with a function like mapPositionToNode(_pos: Position)
    */
}
declare namespace Script {
    export enum SELECTION_ORDER {
        /** Selects options in order, loops around when found */
        SEQUENTIAL = "sequential",
        /** Chooses random options for the entire fight */
        RANDOM_EACH_FIGHT = "randomEachFight",
        /** Chooses random options for each round */
        RANDOM_EACH_ROUND = "randomEachRound",
        /** Chooses all options, always starting from the first */
        ALL = "all"
    }
    export interface Selection {
        order: SELECTION_ORDER;
        /** how many should be selected. Leave blank or 0 to select all. */
        amount?: number;
    }
    export type Selectable<T> = T | {
        options: T[];
        selection: Selection;
    };
    export enum AREA_SHAPE_PATTERN {
        /** Choose your own pattern */
        PATTERN = "pattern"
    }
    export enum AREA_SHAPE_OTHERS {
        /** Target a single Slot */
        SINGLE = "single",
        /** Target an entire row */
        ROW = "row",
        /** Target an entire column */
        COLUMN = "column",
        /** Target enemies in a plus shape, so basically column + row */
        PLUS = "plus",
        /** Target enemies in an X shape, so all the corners but not the center */
        DIAGONALS = "diagonals",
        /** Target all enemies except in the center position */
        SQUARE = "square"
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
        pattern: GridData<any>;
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
        ALLY = "ally",
        /** Your opponents side */
        OPPONENT = "opponent"
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
    export function getTargets(_target: Target, _allies: Grid<IEntity>, _opponents: Grid<IEntity>, _self?: IEntity): IEntity[];
    export {};
}
declare namespace Script {
    enum SPELL_TYPE {
        /** Blocks 1 damage per shield, destroyed after */
        SHIELD = "shield",
        /** Reflects damage back to attacker once, shields from damage. */
        MIRROR = "mirror",
        /** Doubles damage of next attack, destroyed after. Max 1 used per attack. */
        STRENGTH = "strength",
        /** Deals 1 damage to attacker once, destroyed after. */
        THORNS = "thorns",
        /** Takes double damage from next attack. Max 1 used per attack */
        VULNERABLE = "vulnerable",
        /** Next attack doesn't deal any damage. Max 1 used per attack */
        WEAKNESS = "weakness",
        /** Deals 1 damage at the end of the round per poison stack. Removes 1 per round. */
        POISON = "poison",
        /** Deals 1 damage at the end of the round. Removes 1 per round. */
        FIRE = "fire",
        GOLD = "gold"
    }
    interface SpellDataNoTarget {
        type: SPELL_TYPE;
        /** Strength of the spell. Default: 1 */
        level?: number;
    }
    interface SpellData extends SpellDataNoTarget {
        target: Target;
    }
}
declare namespace Script {
    /**
     * ```
     * OPPONENT | [0, 0] [1, 0] [2, 0]
     * OPPONENT | [0, 1] [1, 1] [2, 1]
     * OPPONENT | [0, 2] [1, 2] [2, 2]
     * ```
     */
    type Position = [number, number];
}
declare namespace Script {
    namespace DataContent {
        const entities: EntityData[];
    }
}
declare namespace Script {
    namespace DataContent {
        const fights: FightData[];
    }
}
declare namespace Script {
    interface DataData {
        fights: FightData[];
        entities: EntityData[];
        entityMap: {
            [id: string]: EntityData;
        };
    }
    class Data {
        private data;
        load(): Promise<void>;
        get fights(): readonly FightData[];
        get entities(): readonly EntityData[];
        getEntity(_id: string): Readonly<EntityData> | undefined;
        private resolveParent;
    }
}
declare namespace Script {
    interface FightData {
        /** How many rounds this fight should take until it's considered "passed" even if not all enemies are defeated. */
        rounds: number;
        /** Use the string identifiers from the entities to define what goes where. */
        entities: GridData<string>;
        /** Difficulty rating for the fight. Unused for now */
        difficulty?: number;
    }
    interface Arena {
        home: Grid<IEntity>;
        away: Grid<IEntity>;
    }
    class Fight {
        rounds: number;
        arena: Arena;
        protected visualizer: IVisualizeFight;
        protected HUD: VisualizeHUD;
        constructor(_fight: FightData, _home: Grid<IEntity>);
        getRounds(): number;
        run(): Promise<void>;
        private runOneSide;
    }
}
declare namespace Script {
    interface IVisualizer {
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
        getHUD(): VisualizeHUD;
        addToScene(_el: ƒ.Node): void;
        getCamera(): ƒ.ComponentCamera;
        getRoot(): ƒ.Node;
        initializeScene(_viewport: ƒ.Viewport): void;
        drawScene(): void;
        getGraph(): ƒ.Graph;
    }
    import ƒ = FudgeCore;
    class VisualizerNull implements IVisualizer {
        root: ƒ.Node;
        camera: ƒ.ComponentCamera;
        viewport: ƒ.Viewport;
        constructor();
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
        getHUD(): VisualizeHUD;
        initializeScene(_viewport: ƒ.Viewport): void;
        addToScene(_el: ƒ.Node): void;
        getCamera(): ƒ.ComponentCamera;
        getRoot(): ƒ.Node;
        getGraph(): ƒ.Graph;
        drawScene(): void;
    }
}
declare namespace Script {
    interface VisualizeHUD {
        sayHello(): void;
        addFightListeners(): void;
    }
    class VisualizeHUD implements VisualizeHUD {
        constructor();
        private roundStart;
        private updateRoundCounter;
    }
}
declare namespace Script {
    class Provider {
        #private;
        static get data(): Readonly<Data>;
        static get visualizer(): Readonly<IVisualizer>;
        static get HUD(): Readonly<VisualizeHUD>;
        static setVisualizer(_vis: IVisualizer): void;
    }
}
declare namespace Script {
}
declare namespace Script {
    type SelectableWithData<T> = Selectable<T> & {
        counter?: number;
    };
    export interface EntityData {
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
        moves?: Selectable<MoveData>;
        spells?: Selectable<SpellData>;
        attacks?: Selectable<AttackData>;
        /** If it's in this list, this kind of spell is ignored by the entity.*/
        resistances?: SPELL_TYPE[];
        abilities?: AbilityData[];
    }
    export interface IEntity extends EntityData {
        currentHealth: number;
        position: Position;
        move(_friendly: Grid<IEntity>): Promise<void>;
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>;
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>;
        damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number>;
        affect(_spell: SpellData, _cause?: IEntity): Promise<number>;
        getOwnDamage(): number;
        updateVisuals(_arena: Arena): void;
        registerEventListeners(): void;
        getVisualizer(): VisualizeEntity;
        setGrids(_home: Grid<IEntity>, _away: Grid<IEntity>): void;
    }
    export class Entity implements IEntity {
        #private;
        currentHealth: number;
        position: Position;
        id: string;
        parent?: string;
        health?: number;
        moves?: Selectable<MoveData>;
        spells?: Selectable<SpellData>;
        attacks?: Selectable<AttackData>;
        abilities?: AbilityData[];
        resistances?: SPELL_TYPE[];
        resistancesSet?: Set<SPELL_TYPE>;
        startDirection?: number;
        activeEffects: Map<SPELL_TYPE, number>;
        protected visualizer: VisualizeEntity;
        constructor(_entity: EntityData, _vis: IVisualizer, _pos?: Position);
        getVisualizer(): VisualizeEntity;
        damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number>;
        affect(_spell: SpellData, _cause?: IEntity): Promise<number>;
        move(): Promise<void>;
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _spells?: SpellData[], _targetsOverride?: IEntity[]): Promise<void>;
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _attacks?: AttackData[], _targetsOverride?: IEntity[]): Promise<void>;
        getOwnDamage(): number;
        updateVisuals(): void;
        protected select<T extends Object>(_options: SelectableWithData<T>, _use: boolean): T[];
        protected getDamageOfAttacks(_attacks: Readonly<AttackDataNoTarget[]>, _consumeEffects: boolean): number;
        setGrids(_home: Grid<Entity>, _away: Grid<Entity>): void;
        registerEventListeners(): void;
        private abilityEventListener;
        protected runAbility(_ev: FightEvent): Promise<void>;
        private endOfRoundEventListener;
        protected handleEndOfTurn(_ev: FightEvent): Promise<void>;
    }
    export {};
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
    interface AbilityData {
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
        attack?: AttackDataNoTarget;
        spell?: SpellDataNoTarget;
    }
}
declare namespace Script {
    interface AttackDataNoTarget {
        baseDamage: number;
        /** default: 0 */
        baseCritChance?: number;
    }
    interface AttackData extends AttackDataNoTarget {
        target: Target;
    }
}
declare namespace Script {
    /**
     * **!! This data is rotated when converted to Grid !!**
     * That means that the data entered here aligns the way [[Position]] is done once converted.
     * So enter your data like this:
     *
     * ```
     * OPPONENT | [0, 0] [1, 0] [2, 0]
     * OPPONENT | [0, 1] [1, 1] [2, 1]
     * OPPONENT | [0, 2] [1, 2] [2, 2]
     * ```
     */
    type GridData<T> = [[T, T, T], [T, T, T], [T, T, T]];
    class Grid<T> {
        grid: GridData<T>;
        constructor(_content?: GridData<T>);
        static EMPTY<T>(): GridData<T | undefined>;
        get(_pos: Position): T;
        set(_pos: Position, _el: T): T;
        forEachElement(callback: (element?: T, pos?: Position) => void): void;
        forEachElementAsync(callback: (element?: T, pos?: Position) => Promise<void>): Promise<void>;
        get occupiedSpots(): number;
        private outOfBounds;
    }
}
declare namespace Script {
    function initEntitiesInGrid<T extends IEntity>(_grid: GridData<string>, _entity: new (...data: any) => T): Grid<T>;
    function waitMS(_ms: number): Promise<void>;
}
declare namespace Script {
    interface IVisualizeFight {
        showGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
    }
    class VisualizeFightNull implements IVisualizeFight {
        #private;
        constructor(_fight: Fight);
        showGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface VisualizeEntity {
        idle(): Promise<void>;
        attack(_attack: AttackData, _targets: IEntity[]): Promise<void>;
        move(_move: MoveData): Promise<void>;
        hurt(_damage: number, _crit: boolean): Promise<void>;
        resist(): Promise<void>;
        spell(_spell: SpellData, _targets: IEntity[]): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): void;
    }
    class VisualizeEntity extends ƒ.Node {
        private entity;
        private static mesh;
        private static material;
        private size;
        constructor(_entity: IEntity);
        getEntity(): Readonly<IEntity>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class VisualizeTile extends ƒ.Node {
        private static mesh;
        private static material;
        private size;
        private pos;
        constructor(_name: string, _size: number, _pos: ƒ.Vector3);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class VisualizeTileGrid extends ƒ.Node {
        private tiles;
        private tileSize;
        private spacing;
        private offset;
        private position;
        constructor(_position: ƒ.Vector3);
        private generateGrid;
        getTilePosition(_index: number, _side: string): ƒ.Vector3;
        private layoutGrid;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class IVisualizeGrid extends ƒ.Node {
        grid: Grid<VisualizeEntity>;
        tiles: Grid<VisualizeTile>;
        side: string;
        constructor(_grid: Grid<VisualizeEntity>, _side: string);
        getAnchor(_side: ƒ.Node, _x: number, _z: number): ƒ.Node;
    }
}
