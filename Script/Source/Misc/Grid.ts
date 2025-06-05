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
            for (let x: number = 0; x < 3; x++) {
                for (let y: number = 0; y < 3; y++) {
                    this.grid[x][y] = _content[y][x];
                }
            }
        };

        static EMPTY<T>(): GridData<T | undefined> {
            return [[, , ,], [, , ,], [, , ,]];
        }

        public get(_pos: Position) {
            if (this.outOfBounds(_pos)) return undefined;
            return this.grid[_pos[0]][_pos[1]];
        }
        public set(_pos: Position, _el: T) {
            if (this.outOfBounds(_pos)) return undefined;
            return this.grid[_pos[0]][_pos[1]] = _el;
        }
        public forEachElement(callback: (element?: T, pos?: Position) => void): void {
            callback(this.grid[0][0], [0, 0]);
            callback(this.grid[1][0], [1, 0]);
            callback(this.grid[2][0], [2, 0]);
            callback(this.grid[0][1], [0, 1]);
            callback(this.grid[1][1], [1, 1]);
            callback(this.grid[2][1], [2, 1]);
            callback(this.grid[0][2], [0, 2]);
            callback(this.grid[1][2], [1, 2]);
            callback(this.grid[2][2], [2, 2]);
        }

        public async forEachElementAsync(callback: (element?: T, pos?: Position) => Promise<void>): Promise<void> {
            await callback(this.grid[0][0], [0, 0]);
            await callback(this.grid[1][0], [1, 0]);
            await callback(this.grid[2][0], [2, 0]);
            await callback(this.grid[0][1], [0, 1]);
            await callback(this.grid[1][1], [1, 1]);
            await callback(this.grid[2][1], [2, 1]);
            await callback(this.grid[0][2], [0, 2]);
            await callback(this.grid[1][2], [1, 2]);
            await callback(this.grid[2][2], [2, 2]);
        }

        public get occupiedSpots(): number {
            let total: number = 0;
            this.forEachElement((el) => {
                if (el) total++;
            })
            return total;
        }

        private outOfBounds(_pos: Position): boolean {
            return _pos[0] < 0 || _pos[0] > 2 || _pos[1] < 0 || _pos[1] > 2;
        }
    }
}