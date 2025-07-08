namespace Script {
    export enum DIRECTION_RELATIVE {
        FORWARD = "forward",
        BACKWARD = "backward",
        LEFT = "left",
        RIGHT = "right",
    }
    
    export interface MoveData {
        /** rotates the unit _clockwise_ by 45° per increment of this value.  
         * **rotation occurs before movement** and is entirely mechanical, not visual.
         */
        rotateBy?: number,
        //direction: DIRECTION_RELATIVE,
        distance: number,
        /** If this unit is blocked from moving in the desired direction, what should it do? */
        blocked?: {
            /** how many increments of 45° should it rotate _(clockwise)_ to try again? */
            rotateBy: number,
            /** How many attempts should it make to rotate and move again? default: 1, max 8 */
            attempts?: number,
        }
    }

    /**Move the Entity based of the Grid Data then map the position to the empty nodes in the Graph with a mapping function
     * this could also be done in the Visualizer with a function like mapPositionToNode(_pos: Position)
    */
}