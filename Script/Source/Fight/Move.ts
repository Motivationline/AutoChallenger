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
        direction: DIRECTION_RELATIVE,
        currentDirection: Position,
        distance: number,
        /** If this unit is blocked from moving in the desired direction, what should it do? */
        blocked?: {
            /** how many increments of 45° should it rotate _(clockwise)_ to try again? */
            rotateBy: number,
            /** How many attempts should it make to rotate and move again? default: 1, max 8 */
            attempts?: number,
        }
    }

    //iterates through the grid and executes every entities move
    export async function move(_grid: Grid<Entity>) {
        let maxAlternatives: number = 0;
        let movedEntites: number = 0;
        _grid.forEachElement((el) => {
            el.moved = false;
        });
        //loop untill all alternatives have been tried and every entity moved
        while (maxAlternatives <= 8 && movedEntites < _grid.occupiedSpots) {
            let movedThisTurn = false;
            await _grid.forEachElementAsync(async (el) => {
                //check if the Entity hasn't moved yet
                if (el.moved == false) {
                    //try to move
                    let res = await el.tryToMove(_grid, maxAlternatives);
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
        //all entities moved
    }

    // returns the new direction, the entity will move in
    export function getNextDirection(_rotateBy: number, _direction: Position): Position {
        let directions: Position[] = [
            [1, 0],    // North
            [1, 1],    // North-West
            [0, 1],    // West
            [-1, 1],   // South-West
            [-1, 0],   // South
            [-1, -1],  // South-East
            [0, -1],   // East
            [1, -1]    // North-East
        ];
        let i: number = directions.findIndex(dir => dir[0] === _direction[0] && dir[1] === _direction[1]);
        //get the index for the next rotation
        let selector: number = (i + _rotateBy) % 8;
        //get the direction from the array
        let dir: Position = directions[selector]
        
        return dir;
    }

    // returns the next position based on the current position, the entities rotation and the step size
    export function getPositionBasedOnMove(_pos: Position, _direction: Position, _step: number, _rotateBy: number): Position {
        //console.log("direction: " + _direction + ", step: " + _step + ", position: " + _pos + ", rotateBy: " + _rotateBy);
        let dir: Position = getNextDirection(_rotateBy, _direction);
        let pos: Position = [_step * dir[0] + _pos[0] , _step * dir[1] + _pos[1]];
        //console.log(" New direction: " + dir + ", New position: " + pos);
        return pos;
    }
}