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

    // function move(_fight: Fight) {
    //     //create a new Grid, calls entity[].move(), add them to the grid
    //     let newGrid = new Grid<Entity>();

    //     //move the entities in the grid
    //     _fight.arena.away.forEachElement((entity, pos) => {
    //         entity.move()
    //         newGrid.set(pos, new Entity(entity));
    //     });

    //     //replace old Grid
    //     _fight.arena.away = newGrid;
    // }

    EventBus.addEventListener(EVENT.ROUND_START, eventListener);
    function eventListener(_ev: FightEvent){
        //TODO: call move with correct Grid get the grid somehow
    }

    export function move(_grid: Grid<Entity>) {
        let grid: Grid<Entity> = _grid;
        let maxAlternatives: number = 0;
        let movedEntites: number = 0;
        grid.forEachElement((el, pos) => {
            el.moved = false;   //TODO: maybe add a moved boolean to entity class
        });
        //loop untill all alternatives have been tried and every entity moved
        while (maxAlternatives <= 8 && movedEntites < grid.occupiedSpots) { //TODO: check if && is correct
            let movedThisTurn = false;
            grid.forEachElement((el) => {
                //check if the Entity hasn't moved yet
                if (el.moved == false) {
                    //try to move
                    let res = el.tryToMove(grid, maxAlternatives);
                    if (res) {
                        movedThisTurn = true;
                        movedEntites++;
                    }
                }
            });
            if (movedThisTurn == false) {
                maxAlternatives++;
            }
        }
    }
}