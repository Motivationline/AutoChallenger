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
                let validTargets = getTargets(condition.target, _arena.home, _arena.away, this).targets;
                if (!validTargets.includes(_ev.target)) return false;
            }
            if (condition.cause && _arena && _ev.cause) {
                let validTargets = getTargets(condition.cause, _arena.home, _arena.away, this).targets;
                if (_ev.cause instanceof Entity && !validTargets.includes(_ev.cause)) return false;
            }
            let level = _ev.detail.level;
            if (condition.value && level !== undefined) {
                if (typeof condition.value === "number") {
                    if (condition.value !== level) return false;
                } else {
                    let min = condition.value.min ?? -Infinity;
                    let max = condition.value.max ?? Infinity;
                    if (min > level || max < level) return false;
                }
            }
        }
        return true;
    }

    export async function executeAbility(_ability: AbilityData, _arena: Arena, _ev: FightEvent) {
        if (!_ability || !_ev) return;
        // correct type of event
        if (Array.isArray(_ability.on)) {
            if (!_ability.on.includes(_ev.type)) return;
        } else {
            if (_ability.on !== _ev.type) return;
        }

        if (!areAbilityConditionsMet.call(this, _ability, _arena, _ev)) return;

        // if we get here, we're ready to do the ability
        let targets: IEntity[] = undefined;
        if (_ability.target === "cause") {
            if (_ev.cause && _ev.cause instanceof Entity)
                targets = [_ev.cause]
        }
        else if (_ability.target === "target") {
            if (_ev.target)
                targets = [_ev.target]
        }
        else {
            targets = getTargets(_ability.target, _arena.home, _arena.away, this).targets;
        }

        // no targets found, no need to do the ability
        if (!targets || targets.length === 0) return;

        await EventBus.dispatchEvent({ type: EVENT.TRIGGER_ABILITY, cause: this, target: this, trigger: _ability });
        if (_ability.attack) {
            await executeAttack.call(this, [{ target: undefined, ..._ability.attack }], _arena.home, _arena.away, targets);
        }

        if (_ability.spell) {
            await executeSpell.call(this, [{ target: undefined, ..._ability.spell }], _arena.home, _arena.away, targets);
        }
        await EventBus.dispatchEvent({ type: EVENT.TRIGGERED_ABILITY, cause: this, target: this, trigger: _ability });
    }


    export async function executeSpell(_spells: SpellData[], _friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _targetsOverride?: IEntity[]) {
        if (!_spells) return;
        for (let spell of _spells) {
            let targets: IEntity[], side: TARGET_SIDE, positions: Grid<boolean>;
            if (_targetsOverride) {
                targets = _targetsOverride;
            } else {
                ({ targets, side, positions } = getTargets(spell.target, _friendly, _opponent, this));
            }
            await EventBus.dispatchEvent({ type: EVENT.ENTITY_SPELL_BEFORE, trigger: spell, cause: this, target: this, detail: { targets, side, positions } });
            for (let target of targets) {
                await target.affect(spell, this);
            }
            await EventBus.dispatchEvent({ type: EVENT.ENTITY_SPELL, trigger: spell, cause: this, target: this, detail: { targets, side, positions } });
        }
    }

    export async function executeAttack(_attacks: AttackData[], _friendly: Grid<IEntity>, _opponent: Grid<IEntity>, _targetsOverride?: IEntity[]) {
        if (!_attacks || _attacks.length === 0) return;
        for (let attack of _attacks) {
            let attackDmg = this.getDamageOfAttacks([attack], true);
            // get the target(s)
            let targets: IEntity[], side: TARGET_SIDE, positions: Grid<boolean>;
            if (_targetsOverride) {
                targets = _targetsOverride;
            } else {
                ({ targets, side, positions } = getTargets(attack.target, _friendly, _opponent, this));
            }
            await EventBus.dispatchEvent({ type: EVENT.ENTITY_ATTACK, cause: this, target: this, trigger: attack, detail: { damage: attackDmg, targets, side, positions } })
            for (let target of targets) {
                await target.damage(attackDmg, attack.baseCritChance, this);
            }
            await EventBus.dispatchEvent({ type: EVENT.ENTITY_ATTACKED, cause: this, target: this, trigger: attack, detail: { damage: attackDmg, targets, side, positions } })
        }
    }
}