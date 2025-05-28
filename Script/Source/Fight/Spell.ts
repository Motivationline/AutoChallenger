namespace Script {

    export enum SPELL_TYPE {
        // positive buffs

        /** Blocks 1 damage per shield, destroyed after */
        SHIELD,
        /** Reflects damage back to attacker once, shields from damage. */
        MIRROR,
        /** Doubles damage of next attack, destroyed after. Max 1 used per attack. */
        STRENGTH,
        /** Deals 1 damage to attacker once, destroyed after. */
        THORNS,

        // negative
        /** Takes double damage from next attack. Max 1 used per attack */
        VULNERABLE,
        /** Next attack doesn't deal any damage. Max 1 used per attack */
        WEAKNESS,
        /** Deals 1 damage at the end of the round per poison stack. Removes 1 per round. */
        POISON,
        /** Deals 1 damage at the end of the round. Removes 1 per round. */
        FIRE,

        // not fight related
        GOLD,
    }

    export interface SpellNoTarget {
        type: SPELL_TYPE,
        /** Strength of the spell. Default: 1 */
        level?: number,
    }
    export interface Spell extends SpellNoTarget {
        target: Target,
    }

    export interface Spells {
        spells: Spell[],
        selection: Selection,
    }

    
}