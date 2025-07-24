namespace Script {

    //Visualize the Entities in the Grid
    //Instances the Entities in the correct grid Position

    import ƒ = FudgeCore;

    export class VisualizeGrid extends ƒ.Node {

        grid: Grid<VisualizeEntity>;

        side: string;

        constructor(_grid: Grid<VisualizeEntity>, _side: string) {
            super("VisualizeGrid");
            this.grid = _grid;
            if (_side === "home" || "away") {
                this.side = _side;
            } else {
                throw new Error("Use home or away for the side parameter");
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

                let visSide: ƒ.Node;
                //get Anchors from scene
                if (this.side === "away") {
                    visSide = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
                } else if (this.side === "home") {
                    visSide = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
                }

                //let away: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("away")[0];

                /**Anchors are named from 0-8 */
                _anchor = this.getAnchor(visSide, _pos[0], _pos[1]);
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


        getAnchor(_side: ƒ.Node, _x: number, _z: number): ƒ.Node {
            let anchor: ƒ.Node;
            let pointer: number = _z * 3 + _x;
            console.log("pointer: " + pointer);
            anchor = _side.getChildByName(pointer.toString());
            return anchor;
        }

        nuke() {
            this.grid.forEachElement((_el, pos) => {
                this.removeEntityFromGrid(pos);
            })
        }

        move() {
            let _entity: VisualizeEntity;
            let position: Position;
            //read entity Positions and move the model to the fitting ancor in the Scene
            this.grid.forEachElement((entity, pos) => {
                position = pos;
                _entity = entity

                let visSide: ƒ.Node;
                //get Anchors from scene
                if (this.side === "away") {
                    visSide = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
                } else if (this.side === "home") {
                    visSide = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
                }

                //let away: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("away")[0];

                /**Anchors are named from 0-8 */
                let _anchor = this.getAnchor(visSide, position[0], position[1]);

                //get the Positions from the placeholders and translate the entity to it
                let pos3: ƒ.Vector3 = _anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;
                entity.mtxLocal.translation = pos3.clone;
            });
        }

        addEventListeners(): void {
            EventBus.addEventListener(EVENT.ENTITY_MOVED, this.move);
        }

        removeEventListeners(): void {
            //EventBus.removeEventListener(EVENT.ENTITY_MOVED); TODO: Fix this
        }

    }

}