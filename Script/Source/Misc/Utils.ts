namespace Script {
    export namespace Utils {
        export function forEachElement<T>(_grid: Grid<T>, callback: (element?: T, pos?: Position) => void): void {
            callback(_grid[0][0], [0, 0]);
            callback(_grid[1][0], [1, 0]);
            callback(_grid[2][0], [2, 0]);
            callback(_grid[0][1], [0, 1]);
            callback(_grid[1][1], [1, 1]);
            callback(_grid[2][1], [2, 1]);
            callback(_grid[0][2], [0, 2]);
            callback(_grid[1][2], [1, 2]);
            callback(_grid[2][2], [2, 2]);
        }

        export async function forEachElementAsync<T>(_grid: Grid<T>, callback: (element?: T, pos?: Position) => Promise<void>): Promise<void> {
            await callback(_grid[0][0], [0, 0]);
            await callback(_grid[1][0], [1, 0]);
            await callback(_grid[2][0], [2, 0]);
            await callback(_grid[0][1], [0, 1]);
            await callback(_grid[1][1], [1, 1]);
            await callback(_grid[2][1], [2, 1]);
            await callback(_grid[0][2], [0, 2]);
            await callback(_grid[1][2], [1, 2]);
            await callback(_grid[2][2], [2, 2]);
        }

    }
    export namespace Grid {
        export function EMPTY<T>(): Grid<T | undefined> {
            return [[, , ,], [, , ,], [, , ,]];
        }
    }
    export async function waitMS(_ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        })
    }
}