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

    // @Björn die Verrenkung brauchst du nicht machen, du kannst move() einfach direkt in der Fight runOneSide aufrufen
    // außerdem ist das EntityMove Event dazu gedacht dass eine Entity das auslöst, wenn sie sich bewegt
    // ✓
    // @Björn hier sollten noch ein paar asyncs und awaits rein
    export async function move(_grid: Grid<Entity>) {
        console.log("start Grid: ");
        console.log(_grid);
        //let grid: Grid<Entity> = _grid;
        let maxAlternatives: number = 0;
        let movedEntites: number = 0;
        _grid.forEachElement((el) => {
            el.moved = false;
        });
        //loop untill all alternatives have been tried and every entity moved
        while (maxAlternatives <= 8 && movedEntites < _grid.occupiedSpots) {
            let movedThisTurn = false;
            await _grid.forEachElement((el) => {
                //check if the Entity hasn't moved yet
                if (el.moved == false) {
                    //try to move
                    let res = el.tryToMove(_grid, maxAlternatives);
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
        console.log("moved Away Grid: ");
        console.log(_grid);
    }

    export function getNextDirection(_rotateBy: number, _direction: Position): Position {
        let directions: Position[] = [
            [1, 0],    // East
            [1, 1],    // North-East
            [0, 1],    // North
            [-1, 1],   // North-West
            [-1, 0],   // West
            [-1, -1],  // South-West
            [0, -1],   // South
            [1, -1]    // South-East
        ];
        let i: number = directions.findIndex(dir => dir[0] === _direction[0] && dir[1] === _direction[1]);
        //get the index for the next rotation
        let selector: number = (i + _rotateBy) % 8;
        //get the direction from the array
        let dir: Position = directions[selector]
        
        return dir;
    }

    // calculate the next position based on the current position, the entities rotation and the step size
    export function getPositionBasedOnMove(_pos: Position, _direction: Position, _step: number, _rotateBy: number): Position {
        console.log("direction: " + _direction + "step: " + _step + "position: " + _pos + "rotateBy: " + _rotateBy);
        let dir: Position = getNextDirection(_rotateBy, _direction);
        let pos: Position = [_step * dir[0] + _pos[0] , _step * dir[1] + _pos[1]];
        console.log("New direction: " + dir + "New position: " + pos);
        return pos;
    }
}