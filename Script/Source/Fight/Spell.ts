namespace Script {

    export enum SPELL_TYPE {
        // positive buffs

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

        // negative
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

        // not fight related
        // GOLD = "gold",
    }

    export interface SpellDataNoTarget {
        type: SPELL_TYPE,
        /** Strength of the spell. Default: 1 */
        level?: number,
    }
    export interface SpellData extends SpellDataNoTarget {
        target: Target,
    }

    
}