namespace Script {
   
    export interface AttackNoTarget {
        baseDamage: number,
        /** default: 0 */
        baseCritChance?: number,
    }

    export interface Attack extends AttackNoTarget {
        target: Target,
    }

    export interface Attacks {
        attacks: Attack[],
        selection: Selection
    }
 
}