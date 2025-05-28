namespace Script {
    export interface IVisualizeGrid {
        getRealPosition(_pos: Position): any;
        updateVisuals(): void;
    }

    export class VisualizeGridNull implements IVisualizeGrid {
        #grid: Grid<iEntity>
        constructor(_grid: Grid<iEntity>) {
            this.#grid = _grid;
        }
        updateVisuals(): void {
            Utils.forEachElement(this.#grid, (element) => {
                element.updateVisuals();
            });
        }

        getRealPosition(_pos: Position) {
            return _pos;
        }
    }
}