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

    function move(_fight: Fight) {
        //create a new Grid, calls entity[].move(), add them to the grid
        let newGrid = new Grid<Entity>();

        //move the entities in the grid
        _fight.arena.away.forEachElement((entity, pos) => {
            entity.move()
            newGrid.set(pos, new Entity(entity));
        });

        //replace old Grid
        _fight.arena.away = newGrid;
    }
}