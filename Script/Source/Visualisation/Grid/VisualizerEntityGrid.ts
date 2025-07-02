// namespace Script {

//     import ƒ = FudgeCore;

//     export interface IVisualizeGrid {
//         getRealPosition(_pos: Position): any;
//         updateVisuals(): void;
//     }

//     export class VisualizeGridNull extends ƒ.Node implements IVisualizeGrid {
//         grid: Grid<VisualizeEntity>;
//         constructor(_grid: Grid<VisualizeEntity>) {
//             super("VisualizeGridNull");
//             this.grid = _grid;
//             this.addComponent(new ƒ.ComponentTransform());
//             this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3(0, 0, 0));
//         }

//         updateVisuals(): void {
//             this.grid.forEachElement((element) => {
//                 element?.updateVisuals();
//             });
//         }

//         getRealPosition(_pos: Position) {
//             return _pos;
//         }
//     }
// }