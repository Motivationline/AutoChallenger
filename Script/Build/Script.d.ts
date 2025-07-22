declare namespace Script {
    enum EVENT {
        RUN_PREPARE = "runPrepare",
        RUN_START = "runStart",
        RUN_END = "runEnd",
        FIGHT_PREPARE = "fightPrepare",
        FIGHT_PREPARE_COMPLETED = "fightPrepareCompleted",
        FIGHT_START = "fightStart",
        FIGHT_END = "fightEnd",
        FIGHT_ENDED = "fightEnded",
        ROUND_START = "roundStart",
        ROUND_END = "roundEnd",
        ENTITY_SPELL_BEFORE = "entitySpellBefore",
        ENTITY_SPELL = "entitySpell",
        ENTITY_ATTACK = "entityAttack",
        ENTITY_ATTACKED = "entityAttacked",
        ENTITY_HEAL = "entityHeal",// could be covered by ENTITY_AFFECT, but easier shortcut for probably often used heal effect.
        ENTITY_HEALED = "entityHealed",
        ENTITY_AFFECT = "entityAffect",
        ENTITY_AFFECTED = "entityAffected",
        ENTITY_HURT_BEFORE = "entityHurtBefore",
        ENTITY_HURT = "entityHurt",
        ENTITY_DIES = "entityDies",
        ENTITY_DIED = "entityDied",
        ENTITY_CREATE = "entityCreate",
        ENTITY_CREATED = "entityCreated",
        ENTITY_ADDED = "entityAdded",
        ENTITY_REMOVED = "entityRemoved",
        ENTITY_MOVE = "entityMove",// unused for now
        ENTITY_MOVED = "entityMoved",// unused for now
        TRIGGER_ABILITY = "triggerAbility",
        TRIGGERED_ABILITY = "triggeredAbility",
        GOLD_CHANGE = "goldChange",
        CHOOSE_EUMLING = "chooseEumling",
        CHOSEN_EUMLING = "chosenEumling",
        CHOOSE_STONE = "chooseStone",
        CHOSEN_STONE = "chosenStone",
        CHOOSE_ENCOUNTER = "chooseEncounter",
        CHOSEN_ENCOUNTER = "chosenEncounter",
        SHOP_OPEN = "shopOpen",
        SHOP_CLOSE = "shopClose",
        REWARDS_OPEN = "rewardsOpen",
        REWARDS_CLOSE = "rewardsClose",
        EUMLING_XP_GAIN = "eumlingXPGain",
        EUMLING_LEVELUP_CHOOSE = "eumlingLevelupChoose",
        EUMLING_LEVELUP_CHOSEN = "eumlingLevelupChosen",
        EUMLING_LEVELUP = "eumlingLevelup"
    }
    /**
     * There are a lot of callbacks / events that things inside the game can hook into to do something at a specific point in time.
     * We're using a custom system to be able to `await` the Event results to allow for a nice visual sequence to occur.
     *
     *
    */
    interface FightEvent<T = any> {
        /** What kind of event happened? */
        type: EVENT;
        /** Who sent this event? undefined if system */
        target?: IEntity;
        /** Who or what caused the event? Might be empty. */
        cause?: IEntity | Stone;
        /** Optional value for whatever triggered this event. */
        trigger?: AttackData | SpellData | MoveData | AbilityData;
        /** Optional data with more details about this specific event. */
        detail?: T;
    }
    type FightEventListener = (_ev?: FightEvent) => Promise<void> | void;
    class EventBus {
        static listeners: Map<EVENT, FightEventListener[]>;
        static removeAllEventListeners(): void;
        static addEventListener(_ev: EVENT, _fn: FightEventListener): void;
        static removeEventListener(_ev: EVENT, _fn: FightEventListener): void;
        static dispatchEvent<T>(_ev: FightEvent<T>): Promise<void>;
        static awaitSpecificEvent(_type: EVENT): Promise<FightEvent>;
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
        distance: number;
        /** If this unit is blocked from moving in the desired direction, what should it do? */
        blocked?: {
            /** how many increments of 45° should it rotate _(clockwise)_ to try again? */
            rotateBy: number;
            /** How many attempts should it make to rotate and move again? default: 1, max 8 */
            attempts?: number;
        };
    }
    function move(_grid: Grid<Entity>): void;
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
    export function getTargets(_target: Target, _allies: Grid<IEntity>, _opponents: Grid<IEntity>, _self: IEntity): IEntity[];
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
        /** Heals the target by the specified amount. */
        HEAL = "health",
        /** Entity cannot be targeted for this round */
        UNTARGETABLE = "untargetable",
        /** Takes double damage from next attack. Max 1 used per attack */
        VULNERABLE = "vulnerable",
        /** Next attack doesn't deal any damage. Max 1 used per attack */
        WEAKNESS = "weakness",
        /** Deals 1 damage at the end of the round per poison stack. Removes 1 per round. */
        POISON = "poison",
        /** Deals 1 damage at the end of the round. Removes 1 per round. */
        FIRE = "fire",
        /** Entity cannot act at all this turn */
        STUN = "stun",
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
        stones: StoneData[];
        entityMap: {
            [id: string]: EntityData;
        };
    }
    class Data {
        private data;
        load(): Promise<void>;
        get fights(): readonly FightData[];
        get entities(): readonly EntityData[];
        get stones(): readonly StoneData[];
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
    enum FIGHT_RESULT {
        WIN = "win",
        SURVIVE = "survive",
        DEFEAT = "defeat"
    }
    class Fight {
        #private;
        static activeFight: Fight;
        rounds: number;
        arena: Arena;
        constructor(_fight: FightData, _home: Grid<IEntity>);
        get enemyCountAtStart(): number;
        getRounds(): number;
        run(): Promise<FIGHT_RESULT>;
        private fightEnd;
        private runOneSide;
        private handleDeadEntity;
        private handleEntityChange;
        private addEventListeners;
        private removeEventListeners;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Visualizer {
        #private;
        root: ƒ.Node;
        camera: ƒ.ComponentCamera;
        viewport: ƒ.Viewport;
        private entities;
        private fights;
        constructor();
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): VisualizeFight;
        getGUI(): VisualizeGUI;
        initializeScene(_viewport: ƒ.Viewport): void;
        addToScene(_el: ƒ.Node): void;
        getCamera(): ƒ.ComponentCamera;
        getRoot(): ƒ.Node;
        getGraph(): ƒ.Graph;
        drawScene(): void;
        private createEntity;
        private createEntityHandler;
        private fightPrepHandler;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    abstract class UILayer {
        protected element: HTMLElement;
        onAdd(_zindex: number, _ev?: FightEvent): void;
        onShow(): void;
        onHide(): void;
        onRemove(): void;
        abstract addEventListeners(): void;
        abstract removeEventListeners(): void;
    }
}
declare namespace Script {
    class FightUI extends UILayer {
        stoneWrapper: HTMLElement;
        constructor();
        onAdd(_zindex: number, _ev?: FightEvent): void;
        private initStones;
        private updateRoundCounter;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class ChooseEumlingUI extends UILayer {
        optionElements: Map<HTMLElement, Eumling>;
        confirmButton: HTMLButtonElement;
        selectedEumling: Eumling;
        constructor();
        onAdd(_zindex: number): void;
        private clickedEumling;
        private confirm;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class ChooseStoneUI extends UILayer {
        optionElements: Map<HTMLElement, Stone>;
        confirmButton: HTMLButtonElement;
        selectedStone: Stone;
        constructor();
        onAdd(_zindex: number): void;
        private clickedStone;
        private confirm;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class VisualizeGUI {
        readonly uis: Map<string, UILayer>;
        readonly activeLayers: UILayer[];
        constructor();
        private get topmostLevel();
        addUI(_id: string, _ev?: FightEvent): void;
        replaceUI(_id: string, _ev?: FightEvent): void;
        removeTopmostUI(): void;
        removeAllLayers(): void;
        private updateGoldCounter;
        addFightListeners(): void;
        switchUI: (_ev: FightEvent) => void;
    }
}
declare namespace Script {
    class Provider {
        #private;
        static get data(): Readonly<Data>;
        static get visualizer(): Readonly<Visualizer>;
        static get GUI(): Readonly<VisualizeGUI>;
        static setVisualizer(_vis?: Visualizer): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class DataLink extends ƒ.ComponentScript {
        static linkedNodes: Map<string, ƒ.Node>;
        id: string;
        constructor();
    }
    enum ANIMATION {
        IDLE = "idle",
        MOVE = "move",
        HURT = "hurt",
        AFFECTED = "affected",
        DIE = "die",
        ATTACK = "attack",
        SPELL = "spell"
    }
    class AnimationLink extends ƒ.Component {
        static linkedAnimations: Map<string, Map<ANIMATION, ƒ.Animation>>;
        protected singleton: boolean;
        animation: ƒ.Animation;
        animType: ANIMATION;
        constructor();
    }
}
declare namespace Script {
    namespace DataContent {
        const stones: StoneData[];
    }
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
        moved: boolean;
        currentDirection: Position;
    }
    export interface IEntity extends EntityData {
        currentHealth: number;
        position: Position;
        untargetable: boolean;
        move(): Promise<void>;
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>;
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>): Promise<void>;
        damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number>;
        affect(_spell: SpellData, _cause?: IEntity): Promise<number>;
        getOwnDamage(): number;
        registerEventListeners(): void;
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
        moved: boolean;
        currentDirection: Position;
        constructor(_entity: EntityData, _pos?: Position);
        get untargetable(): boolean;
        get stunned(): boolean;
        updateEntityData(_newData: EntityData): void;
        damage(_amt: number, _critChance: number, _cause?: IEntity): Promise<number>;
        affect(_spell: SpellData, _cause?: IEntity): Promise<number>;
        setEffectLevel(_spell: SPELL_TYPE, value: number): Promise<void>;
        move(): Promise<void>;
        tryToMove(_grid: Grid<Entity>, maxAlternatives: number): boolean;
        nextPositionBasedOnThisRotation(rotateBy: number): Position[];
        moveMePls(_move: MoveData, position: Position, _occupiedSpots: Position[]): Position;
        makeAMove(_move: MoveData, position: Position, _occupiedSpots: Position[]): Position;
        checkPosOccupied(_posX: number, _posY: number, _occupiedSpots: Position[]): boolean;
        tryAllMoves(_move: MoveData, _occupiedSpots: Position[]): void;
        useSpell(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _spells?: SpellData[], _targetsOverride?: IEntity[]): Promise<void>;
        useAttack(_friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _attacks?: AttackData[], _targetsOverride?: IEntity[]): Promise<void>;
        getOwnDamage(): number;
        selections: Map<any, any[]>;
        protected select<T extends Object>(_options: SelectableWithData<T>, _use: boolean): T[];
        protected getDamageOfAttacks(_attacks: Readonly<AttackDataNoTarget[]>, _consumeEffects: boolean): number;
        setGrids(_home: Grid<Entity>, _away: Grid<Entity>): void;
        registerEventListeners(): void;
        removeEventListeners(): void;
        private abilityEventListener;
        protected runAbility(_ev: FightEvent): Promise<void>;
        private endOfRoundEventListener;
        protected handleEndOfTurn(_ev: FightEvent): Promise<void>;
        private endOfFightEventListener;
        protected handleEndOfFight(_ev: FightEvent): Promise<void>;
    }
    export {};
}
declare namespace Script {
    class Eumling extends Entity {
        #private;
        static xpRequirements: number[];
        constructor(_startType: string);
        get types(): Readonly<string[]>;
        addType(_type: string): void;
        get type(): string;
        get xp(): number;
        get requiredXPForLevelup(): number;
        addXP(_amount: number): Promise<void>;
        levelup(): Promise<void>;
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
    function areAbilityConditionsMet(_ability: AbilityData, _arena: Arena, _ev: FightEvent): boolean;
    function executeAbility(_ability: AbilityData, _arena: Arena, _ev: FightEvent): Promise<void>;
    function executeSpell(_spells: SpellData[], _friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _targetsOverride?: IEntity[]): Promise<void>;
    function executeAttack(_attacks: AttackData[], _friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _targetsOverride?: IEntity[]): Promise<void>;
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
    interface StoneData {
        id: string;
        abilityLevels: AbilityData[];
    }
    class Stone {
        #private;
        constructor(_data: StoneData, _level?: number);
        set level(_lvl: number);
        get level(): number;
        get data(): StoneData;
        get id(): string;
        addEventListeners(): void;
        removeEventListeners: () => void;
        private abilityEventListener;
        protected runAbility(_ev: FightEvent): Promise<void>;
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
        private static readonly GRIDSIZE;
        constructor(_content?: GridData<T>);
        static EMPTY<T>(): GridData<T | undefined>;
        get(_pos: Position): T;
        set(_pos: Position, _el: T, _removeDuplicates?: boolean): T;
        remove(_pos: Position): T;
        /** Runs through each **POSITION** of the grid, regardless of whether it is set */
        forEachPosition(callback: (element?: T, pos?: Position) => void): void;
        /** Runs through each **POSITION** of the grid, regardless of whether it is set, **await**ing each callback */
        forEachPositionAsync(callback: (element?: T, pos?: Position) => Promise<void>): Promise<void>;
        /** Runs through each **ELEMENT** present in the grid, skips empty spots */
        forEachElement(callback: (element?: T, pos?: Position) => void): void;
        /** Runs through each **ELEMENT** present in the grid, skips empty spots, **await**ing each callback */
        forEachElementAsync(callback: (element?: T, pos?: Position) => Promise<void>): Promise<void>;
        findElementPosition(_element: T): Position;
        get occupiedSpots(): number;
        static outOfBounds(_pos: Position): boolean;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    export function initEntitiesInGrid<T extends IEntity>(_grid: GridData<string>, _entity: new (...data: any) => T): Grid<T>;
    export function waitMS(_ms: number): Promise<void>;
    export function getCloneNodeFromRegistry(id: string): Promise<ƒ.Node | undefined>;
    export function randomRange(min?: number, max?: number): number;
    export function chooseRandomElementsFromArray<T>(_array: readonly T[], _max: number, _exclude?: T[]): T[];
    interface CreateElementAdvancedOptions {
        classes: string[];
        id: string;
        innerHTML: string;
        attributes: [string, string][];
    }
    export function createElementAdvanced<K extends keyof HTMLElementTagNameMap>(_type: K, _options?: Partial<CreateElementAdvancedOptions>): HTMLElementTagNameMap[K];
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    export class PickSphere extends ƒ.Component {
        #private;
        static readonly iSubclass: number;
        constructor();
        get radius(): number;
        set radius(_r: number);
        get radiusSquared(): number;
        offset: ƒ.Vector3;
        get mtxPick(): ƒ.Matrix4x4;
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void;
        /**
         * finds all pickSpheres within the given ray
         * @param ray the ray to check against
         * @param options options
         */
        static pick(ray: ƒ.Ray, options?: Partial<PickSpherePickOptions>): PickSphere[];
        private static get defaultOptions();
    }
    interface PickSpherePickOptions {
        /** Sets by what metric to sort the results. Unsorted if undefined */
        sortBy?: "distanceToRay" | "distanceToRayOrigin";
        branch: ƒ.Node;
    }
    export {};
}
declare namespace Script {
    /** Handles an entire run */
    class Run {
        #private;
        static currentRun: Run;
        eumlings: Eumling[];
        stones: Stone[];
        progress: number;
        encountersUntilBoss: number;
        constructor();
        get gold(): number;
        changeGold(_amt: number): Promise<void>;
        start(): Promise<void>;
        private chooseEumling;
        private chooseStone;
        private runStep;
        private chooseNextEncounter;
        nextEncounter(_difficulty: number): Promise<FightData>;
        prepareFight(_fight: FightData): Promise<void>;
        private runFight;
        private giveRewards;
        end(_success?: boolean): Promise<void>;
        private handleGoldAbility;
        private handleStoneAddition;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    interface IVisualizeFight {
        showGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
    }
    class VisualizeFight implements IVisualizeFight {
        #private;
        home: VisualizeGrid;
        away: VisualizeGrid;
        constructor(_fight: Fight);
        showGrid(): Promise<void>;
        nukeGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
        entityAdded(_ev: FightEvent): void;
        entityRemoved(_ev: FightEvent): void;
        addEventListeners(): void;
        removeEventListeners(): void;
        eventListener: (_ev: FightEvent) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface VisualizeEntity {
        attack(_ev: FightEvent): Promise<void>;
        move(_move: MoveData): Promise<void>;
        getHurt(_ev: FightEvent): Promise<void>;
        resist(): Promise<void>;
        useSpell(_ev: FightEvent): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): void;
    }
    class VisualizeEntity extends ƒ.Node {
        private entity;
        private cmpAnimation;
        private defaultAnimation;
        private tmpText;
        constructor(_entity: IEntity);
        getAffected(_ev: FightEvent): Promise<void>;
        die(_ev: FightEvent): Promise<void>;
        loadModel(_id: string): Promise<void>;
        givePlaceholderPls(): ƒ.Node;
        private playAnimationIfPossible;
        private showFallbackText;
        private updateTmpText;
        getEntity(): Readonly<IEntity>;
        addEventListeners(): void;
        removeEventListeners(): void;
        eventListener: (_ev: FightEvent) => Promise<void>;
        handleEvent(_ev: FightEvent): Promise<void>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class VisualizeGrid extends ƒ.Node {
        grid: Grid<VisualizeEntity>;
        side: string;
        constructor(_grid: Grid<VisualizeEntity>, _side: string);
        addEntityToGrid(_entity: VisualizeEntity, _pos: Position, _removeExisting?: boolean, _anchor?: ƒ.Node): void;
        removeEntityFromGrid(_pos: Position): void;
        getAnchor(_side: ƒ.Node, _x: number, _z: number): ƒ.Node;
        nuke(): void;
    }
}
declare namespace Script {
    class EumlingLevelupUI extends UILayer {
        eumling: Eumling;
        eumlingElement: HTMLElement;
        optionsElement: HTMLElement;
        infoElement: HTMLElement;
        confirmButton: HTMLButtonElement;
        selectedOption: string;
        static orientationInfo: Map<string, string>;
        constructor();
        onAdd(_zindex: number, _ev?: FightEvent): void;
        private selectOption;
        private confirm;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class FightPrepUI extends UILayer {
        stoneWrapper: HTMLElement;
        eumlingWrapper: HTMLElement;
        selectedEumling: Eumling;
        startButton: HTMLButtonElement;
        selectedSpace: ƒ.Node;
        eumlingElements: Map<Eumling, HTMLElement>;
        constructor();
        onAdd(_zindex: number, _ev?: FightEvent): void;
        private initStones;
        private initEumlings;
        private pickEumling;
        private clickCanvas;
        private returnEumling;
        private startFight;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class FightRewardUI extends UILayer {
        rewardsOverivew: HTMLElement;
        convertButton: HTMLButtonElement;
        continueButton: HTMLButtonElement;
        constructor();
        eumlings: Map<HTMLElement, Eumling>;
        xp: number;
        gold: number;
        onAdd(_zindex: number, _ev?: FightEvent): void;
        onShow(): void;
        onHide(): void;
        clickOnEumling: (_ev: MouseEvent) => void;
        private updateXPText;
        convert: () => void;
        private finishRewards;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class MainMenuUI extends UILayer {
        constructor();
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class MapUI extends UILayer {
        submitBtn: HTMLButtonElement;
        optionElements: HTMLElement[];
        selectedEncounter: number;
        constructor();
        onAdd(_zindex: number, _ev: FightEvent): void;
        private updateProgress;
        private displayEncounters;
        private selectionDone;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class OptionsUI extends UILayer {
        constructor();
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class RunEndUI extends UILayer {
        continueButton: HTMLButtonElement;
        constructor();
        onAdd(_zindex: number, _ev?: FightEvent): void;
        close: () => void;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    class ShopUI extends UILayer {
        closeButton: HTMLButtonElement;
        stonesWrapper: HTMLElement;
        stonesRefreshButton: HTMLButtonElement;
        stoneUpgradeWrapper: HTMLElement;
        eumlingHealWrapper: HTMLElement;
        constructor();
        onAdd(_zindex: number, _ev?: FightEvent): void;
        private setupStonesToBuy;
        private setupStonesToUpgrade;
        private initEumlingHealing;
        close: () => void;
        refresh: () => void;
        addEventListeners(): void;
        removeEventListeners(): void;
    }
}
declare namespace Script {
    abstract class UIElement {
    }
}
declare namespace Script {
    class EumlingUIElement extends UIElement {
        #private;
        private constructor();
        static getUIElement(_obj: Eumling): EumlingUIElement;
        get element(): HTMLElement;
        get eumling(): Eumling;
        private update;
        addEventListeners(): void;
    }
}
declare namespace Script {
    class StoneUIElement extends UIElement {
        #private;
        private constructor();
        static getUIElement(_obj: Stone): StoneUIElement;
        get element(): HTMLElement;
        get stone(): Stone;
        private update;
        private animate;
        addEventListeners(): void;
    }
}
