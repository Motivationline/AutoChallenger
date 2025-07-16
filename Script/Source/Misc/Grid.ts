namespace Script {
    /**
     * **!! This data is rotated when converted to Grid !!**  
     * That means that the data entered here aligns the way [[Position]] is done once converted.
     * So enter your data like this:
     * 
     * ```
     * OPPONENT | [0, 0] [1, 0] [2, 0]  
     * OPPONENT | [0, 1] [1, 1] [2, 1]  
     * OPPONENT | [0, 2] [1, 2] [2, 2]  
     * ```
     */
    export type GridData<T> = [[T, T, T], [T, T, T], [T, T, T]];

    export class Grid<T> {
        grid: GridData<T>;
        private static readonly GRIDSIZE: number = 3;

        constructor(_content: GridData<T> = Grid.EMPTY<T>()) {
            /* 
            gotta rotate the grid because when entered like this:
                [[e1, e2, e3] <- x: 0
                 [e4, e4, e6] <- x: 1
                 [e7, e8, e9]]<- x: 2
                 y:0 y:1 y:2
                
            the IDs would be the opposite of what you expect through Position:
             [0, 0] [0, 1] [0, 2]
             [1, 0] [1, 1] [1, 2]
             [2, 0] [2, 1] [2, 2]

             thus, we're rotating it so it's more intuitive for the end user.
            */
            this.grid = Grid.EMPTY<T>();
            for (let x: number = 0; x < Grid.GRIDSIZE; x++) {
                for (let y: number = 0; y < Grid.GRIDSIZE; y++) {
                    this.grid[x][y] = _content[y][x];
                }
            }
        };

        static EMPTY<T>(): GridData<T | undefined> {
            return [[, , ,], [, , ,], [, , ,]];
        }

        public get(_pos: Position) {
            if (Grid.outOfBounds(_pos)) return undefined;
            return this.grid[_pos[0]][_pos[1]];
        }
        public set(_pos: Position, _el: T, _removeDuplicates: boolean = false) {
            if (Grid.outOfBounds(_pos)) return undefined;
            if (_removeDuplicates && _el) {
                this.forEachElement((el, pos) => {
                    if (el === _el) this.set(pos, undefined);
                });
            }
            return this.grid[_pos[0]][_pos[1]] = _el;
        }
        public remove(_pos: Position) {
            let currentElement = this.get(_pos);
            this.set(_pos, undefined);
            return currentElement;
        }
        /** Runs through each **POSITION** of the grid, regardless of whether it is set */
        public forEachPosition(callback: (element?: T, pos?: Position) => void): void {
            for (let y: number = 0; y < Grid.GRIDSIZE; y++)
                for (let x: number = 0; x < Grid.GRIDSIZE; x++) {
                    callback(this.grid[x][y], [x, y]);
                }
        }

        /** Runs through each **POSITION** of the grid, regardless of whether it is set, **await**ing each callback */
        public async forEachPositionAsync(callback: (element?: T, pos?: Position) => Promise<void>): Promise<void> {
            for (let y: number = 0; y < Grid.GRIDSIZE; y++)
                for (let x: number = 0; x < Grid.GRIDSIZE; x++) {
                    await callback(this.grid[x][y], [x, y]);
                }
        }

        /** Runs through each **ELEMENT** present in the grid, skips empty spots */
        public forEachElement(callback: (element?: T, pos?: Position) => void): void {
            for (let y: number = 0; y < Grid.GRIDSIZE; y++)
                for (let x: number = 0; x < Grid.GRIDSIZE; x++) {
                    if (this.grid[x][y]) callback(this.grid[x][y], [x, y]);
                }
        }

        /** Runs through each **ELEMENT** present in the grid, skips empty spots, **await**ing each callback */
        public async forEachElementAsync(callback: (element?: T, pos?: Position) => Promise<void>): Promise<void> {
            for (let y: number = 0; y < Grid.GRIDSIZE; y++)
                for (let x: number = 0; x < Grid.GRIDSIZE; x++) {
                    if (this.grid[x][y]) await callback(this.grid[x][y], [x, y]);
                }
        }

        public findElementPosition(_element: T): Position {
            let found: Position;
            this.forEachElement((el, pos) => {
                if (el === _element)
                    found = pos;
            })
            return found;
        }

        public get occupiedSpots(): number {
            let total: number = 0;
            this.forEachElement(() => {
                total++;
            })
            return total;
        }

        public static outOfBounds(_pos: Position): boolean {
            return _pos[0] < 0 || _pos[0] >= Grid.GRIDSIZE || _pos[1] < 0 || _pos[1] >= Grid.GRIDSIZE;
        }
    }
}