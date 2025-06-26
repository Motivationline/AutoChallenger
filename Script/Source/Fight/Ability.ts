namespace Script {
    export interface AbilityCondition {
        /** Is this entity targeted by this?*/
        target?: Target,
        /** Is this entity the cause of this? */
        cause?: Target,
        value?: number | { min?: number, max?: number },
        /** placeholder for other stuff, like testing whether it's a crit or not. Not sure how it's supposed to be implemented yet. */
        otherOptions?: any;
    }

    export interface AbilityData {
        /** When should this ability happen? */
        on: EVENT[] | EVENT,
        /** Single condition or a list of conditions that need to be met for this ability to trigger.
         * Leave empty to always trigger.
         */
        conditions?: AbilityCondition[] | AbilityCondition,
        /** What conditions need to be met for this to happen?  
         * The outer Array is combined using OR, the inner array is combined using AND.
         * 
         * `[["condition1" AND "condition2"] OR ["condition1" AND "condition3"]]`
         * 
         * By default, all conditions are required to be met.
        */
        // requirements?: string[][],
        /** Who should be targeted with this ability? */
        target: "target" | "cause" | Target,
        attack?: AttackDataNoTarget,
        spell?: SpellDataNoTarget,
    }

    export function areAbilityConditionsMet(_ability: AbilityData, _arena: Arena, _ev: FightEvent): boolean {
        if (!_ability.conditions) return true;

        let conditions = Array.isArray(_ability.conditions) ? _ability.conditions : [_ability.conditions];
        for (let condition of conditions) {
            if (condition.target && _arena && _ev.target) {
                let validTargets = getTargets(condition.target, _arena.home, _arena.away, this);
                if (!validTargets.includes(_ev.target)) return false;
            }
            if (condition.cause && _arena && _ev.cause) {
                let validTargets = getTargets(condition.cause, _arena.home, _arena.away, this);
                if (!validTargets.includes(_ev.cause)) return false;
            }
            if (condition.value && _ev.value !== undefined) {
                if (typeof condition.value === "number") {
                    if (condition.value !== _ev.value) return false;
                } else {
                    let min = condition.value.min ?? -Infinity;
                    let max = condition.value.max ?? Infinity;
                    if (min > _ev.value || max < _ev.value) return false;
                }
            }
        }
        return true;
    }

    export async function executeAbility(_ability: AbilityData, _arena: Arena, _ev: FightEvent) {
        if(!_ability || !_ev) return;
        // correct type of event
        if (Array.isArray(_ability.on)) {
            if (!_ability.on.includes(_ev.type)) return;
        } else {
            if (_ability.on !== _ev.type) return;
        }

        if (!areAbilityConditionsMet(_ability, _arena, _ev)) return;

        // if we get here, we're ready to do the ability
        let targets: IEntity[] = undefined;
        if (_ability.target === "cause") {
            if (_ev.cause)
                targets = [_ev.cause]
        }
        else if (_ability.target === "target") {
            if (_ev.target)
                targets = [_ev.target]
        }
        else {
            targets = getTargets(_ability.target, _arena.home, _arena.away, this);
        }

        // no targets found, no need to do the ability
        if (!targets || targets.length === 0) return;

        await EventBus.dispatchEvent({ type: EVENT.TRIGGER_ABILITY, cause: this, target: this, trigger: _ability });
        if (_ability.attack) {
            await this.useAttack(_arena.home, _arena.away, [{ target: undefined, ..._ability.attack }], targets);
        }

        if (_ability.spell) {
            await this.useSpell(_arena.home, _arena.away, [{ target: undefined, ..._ability.spell }], targets);
        }
        await EventBus.dispatchEvent({ type: EVENT.TRIGGERED_ABILITY, cause: this, target: this, trigger: _ability });
    }

}