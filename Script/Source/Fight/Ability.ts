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

    export interface iAbility {
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
        target: "target" | "cause" | Target;
        attack?: AttackNoTarget,
        spell?: SpellNoTarget,
    }
}