namespace Script {

    import ƒ = FudgeCore;

    export interface IVisualizeGrid {
        getRealPosition(_pos: Position): any;
        updateVisuals(): void;
    }

    export class VisualizeGridNull implements IVisualizeGrid {
        grid: Grid<IVisualizeEntity>;
        constructor(_grid: Grid<IVisualizeEntity>) {
            this.grid = _grid;
        }
        
        updateVisuals(): void {
            this.grid.forEachElement((element) => {
                element?.updateVisuals();
            });
        }

        getRealPosition(_pos: Position) {
            return _pos;
        }
    }
}