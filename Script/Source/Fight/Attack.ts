namespace Script {
   
    export interface AttackDataNoTarget {
        baseDamage: number,
        /** default: 0 */
        baseCritChance?: number,
    }

    export interface AttackData extends AttackDataNoTarget {
        target: Target,
    }
 
}