namespace Script {

    export type GridData<T> = [[T, T, T], [T, T, T], [T, T, T]];

    export class Grid<T> {
        grid: GridData<T>;

        constructor(_content: GridData<T> = Grid.EMPTY<T>()) {
            this.grid = _content;
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