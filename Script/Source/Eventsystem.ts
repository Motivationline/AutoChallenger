namespace Script {

    export enum EVENT {
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
        ENTITY_HEAL = "entityHeal", // could be covered by ENTITY_AFFECT, but easier shortcut for probably often used heal effect.
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
        ENTITY_MOVE = "entityMove", // unused for now
        ENTITY_MOVED = "entityMoved", // unused for now
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
        EUMLING_LEVELUP = "eumlingLevelup",
    }

    /**
     * There are a lot of callbacks / events that things inside the game can hook into to do something at a specific point in time.
     * We're using a custom system to be able to `await` the Event results to allow for a nice visual sequence to occur.
     * 
     * 
    */

    export interface FightEvent<T = any> {
        /** What kind of event happened? */
        type: EVENT,
        /** Who sent this event? undefined if system */
        target?: IEntity,
        /** Who or what caused the event? Might be empty. */
        cause?: IEntity | Stone,
        /** Optional value for whatever triggered this event. */
        trigger?: AttackData | SpellData | MoveData | AbilityData,
        /** Optional data with more details about this specific event. */
        detail?: T;
    }

    export type FightEventListener = (_ev?: FightEvent) => Promise<any> | void;

    export class EventBus {
        static listeners = new Map<EVENT, FightEventListener[]>();

        static removeAllEventListeners() {
            this.listeners.clear();
        }

        static addEventListener(_ev: EVENT, _fn: FightEventListener) {
            if (!this.listeners.has(_ev)) {
                this.listeners.set(_ev, []);
            }
            this.listeners.get(_ev)!.push(_fn);
        }

        static removeEventListener(_ev: EVENT, _fn: FightEventListener) {
            let listeners = this.listeners.get(_ev);
            if (!listeners) return;
            let index = listeners.findIndex((v) => v === _fn);
            if (index < 0) return;
            listeners.splice(index, 1);
        }

        static async dispatchEvent<T>(_ev: FightEvent<T>) {
            // TODO think about whether it makes sense to allow only one event active at a time, e.g. through a queue
            if (!this.listeners.has(_ev.type)) return;
            const listeners = [...this.listeners.get(_ev.type)]; // copying this so removing listeners doesn't skip any
            for (let listener of listeners) {
                try {
                    await listener(_ev);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        static dispatchEventWithoutWaiting<T>(_ev: FightEvent<T>): Promise<void>[] {
            if (!this.listeners.has(_ev.type)) return [];
            const listeners = [...this.listeners.get(_ev.type)]; // copying this so removing listeners doesn't skip any
            const promises: Promise<void>[] = [];
            for (let listener of listeners) {
                try {
                    promises.push(new Promise(async (resolve) => { await listener(_ev); resolve(); }));
                } catch (error) {
                    console.error(error);
                }
            }
            return promises;
        }

        static async awaitSpecificEvent(_type: EVENT): Promise<FightEvent> {
            return new Promise((resolve) => {
                const resolver = (_ev: FightEvent) => {
                    this.removeEventListener(_type, resolver);
                    resolve(_ev);
                }
                this.addEventListener(_type, resolver);
            })
        }
    }
}