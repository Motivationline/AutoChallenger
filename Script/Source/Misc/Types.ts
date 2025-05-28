namespace Script {

    //#region Misc

    export type Grid<T> = [[T, T, T], [T, T, T], [T, T, T]]
    /**
     * ```
     * [0, 0] [1, 0] [2, 0]  
     * [0, 1] [1, 1] [2, 1]  
     * [0, 2] [1, 2] [2, 2]  
     * ```
     */
    export type Position = [number, number];

    //#endregion



    //#region Events

    export enum EVENT {
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
        TRIGGERED_ABILITY = "triggeredAbility",
    }

    /**
     * There are a lot of callbacks / events that things inside the game can hook into to do something at a specific point in time.
     * We're using a custom system to be able to `await` the Event results to allow for a nice visual sequence to occur.
     * 
     * 
     */

    export interface FightEvent {
        /** What kind of event happened? */
        type: EVENT,
        /** Who sent this event? */
        target: iEntity,
        /** Who or what caused the event? Might be empty. */
        cause?: iEntity,
        /** Optional value field for relevant events. Might be empty. */
        value?: number,
        /** Optional value for whatever triggered this event. */
        trigger?: Attack | Spell | Move,
    }

    //#endregion

    //#region Fight

    export interface iFight {
        /** How many rounds this fight should take until it's considered "passed" even if not all enemies are defeated. */
        rounds: number,
        /** Use the string identifiers from the entities to define what goes where. */
        entities: Grid<string>,
    }

    export interface Arena {
        home: Grid<iEntity>;
        away: Grid<iEntity>;
    }

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
}