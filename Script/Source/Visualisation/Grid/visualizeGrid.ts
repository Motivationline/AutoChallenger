namespace Script {

    //Visualize the Entities in the Grid
    //Instances the Entities in the correct grid Position

    import ƒ = FudgeCore;

    export class VisualizeGrid extends ƒ.Node {

        grid: Grid<VisualizeEntity>;

        side: string;
        sideNode: ƒ.Node;

        constructor(_grid: Grid<VisualizeEntity>, _side: string) {
            super("VisualizeGrid");
            this.grid = _grid;
            if (_side === "home" || "away") {
                this.side = _side;
            } else {
                throw new Error("Use home or away for the side parameter");
            }

            if (this.side === "away") {
                this.sideNode = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
            } else if (this.side === "home") {
                this.sideNode = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
            }


            this.addComponent(new ƒ.ComponentTransform());
            //set the positions of the entities in the grid
            this.grid.forEachElement((element, pos) => {
                this.addEntityToGrid(element, pos, false);
            });

        }

        addEntityToGrid(_entity: VisualizeEntity, _pos: Position, _removeExisting: boolean = true, _anchor?: ƒ.Node) {
            if (Grid.outOfBounds(_pos)) return;
            if (_removeExisting) {
                this.removeEntityFromGrid(_pos);
            }
            // remove this entity if it's already somewhere in the grid
            this.grid.forEachElement((entity, pos) => {
                if (entity === _entity) this.removeEntityFromGrid(pos);
            });

            if (!_anchor) {
                /**Anchors are named from 0-8 */
                _anchor = this.getAnchor(_pos[0], _pos[1]);
            }
            //get the Positions from the placeholders and translate the entities to it
            let position: ƒ.Vector3 = _anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;

            _entity.mtxLocal.translation = position.clone;
            this.addChild(_entity);
            this.grid.set(_pos, _entity, true);
        }

        removeEntityFromGrid(_pos: Position) {
            if (Grid.outOfBounds(_pos)) return;
            let elementToRemove = this.grid.get(_pos);
            if (!elementToRemove) return;
            this.grid.remove(_pos);
            this.removeChild(elementToRemove);
            // elementToRemove.removeEventListeners();
        }


        getAnchor(_x: number, _z: number): ƒ.Node {
            let anchor: ƒ.Node;
            let pointer: number = _z * 3 + _x;
            console.log("pointer: " + pointer);
            anchor = this.sideNode.getChildByName(pointer.toString());
            return anchor;
        }

        nuke() {
            this.grid.forEachElement((_el, pos) => {
                this.removeEntityFromGrid(pos);
            })
        }

    }

}