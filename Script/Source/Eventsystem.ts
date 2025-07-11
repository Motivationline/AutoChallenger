namespace Script {

    export enum EVENT {
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
        // ENTITY_CREATE = "entityCreate", // unused
        // ENTITY_CREATED = "entityCreated", // unused
        ENTITY_MOVE = "entityMove", // unused for now
        ENTITY_MOVED = "entityMoved", // unused for now
        TRIGGER_ABILITY = "triggerAbility",
        TRIGGERED_ABILITY = "triggeredAbility",
        GOLD_CHANGE = "goldChange",
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
        cause?: IEntity,
        /** Optional value for whatever triggered this event. */
        trigger?: AttackData | SpellData | MoveData | AbilityData,
        /** Optional data with more details about this specific event. */
        detail?: T;
    }

    export type FightEventListener = (_ev?: FightEvent) => Promise<void> | void;

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
            if(!this.listeners.has(_ev.type)) return;
            const listeners = [...this.listeners.get(_ev.type)]; // copying this so removing listeners doesn't skip any
            for (let listener of listeners) {
                await listener(_ev);
            }
        }
    }
}