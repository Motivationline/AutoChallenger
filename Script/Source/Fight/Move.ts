namespace Script {
    export enum DIRECTION_RELATIVE {
        FORWARD,
        BACKWARD,
        LEFT,
        RIGHT,
    }
    
    export interface Move {
        /** rotates the unit _clockwise_ by 45° per increment of this value.  
         * **rotation occurs before movement** and is entirely mechanical, not visual.
         */
        rotateBy?: number,
        direction: DIRECTION_RELATIVE,
        distance: number,
    }

    export interface Moves {
        moves: Move[],
        selection: Selection
    }
}