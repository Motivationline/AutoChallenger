namespace Script {

    //Visualize the Entities in the Grid
    //Instances the Entities in the correct grid Position

    import ƒ = FudgeCore;

    export class IVisualizeGrid extends ƒ.Node {

        grid: Grid<VisualizeEntity>;
        tiles: Grid<VisualizeTile>;

        pos: ƒ.Vector3;

        constructor(_grid: Grid<VisualizeEntity>, _pos: ƒ.Vector3) {
            super("VisualizeGrid");
            this.grid = _grid;
            this.pos = _pos;

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translate(this.pos);

            //add the Tile Grid
            // let tileGrid: ƒ.Node;
            // tileGrid = new VisualizeTileGrid(new ƒ.Vector3(0, 0, 0));
            // Provider.visualizer.addToScene(tileGrid);

            //set the positions of the entities in the grid
            this.grid.forEachElement((element, pos) => {
                if (!element) return;

                //get Placeholders from scene
                let home: ƒ.Node = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
                //let away: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("away")[0];

                /**Anchors are named from 0-8 */
                let anchor: ƒ.Node = this.getAnchor(home, pos[0], pos[1]);
                //get the Positions from the placeholders and translate the entities to it
                let position: ƒ.Vector3 = anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;
                console.log("position: " + position);
                //TODO: Fix Positions
                element.mtxLocal.translation = new ƒ.Vector3(position.x, position.y, position.z).add(this.pos);
                this.addChild(element);
            });

        }
        getAnchor(_side: ƒ.Node, _x: number, _z: number): ƒ.Node {
            let anchor: ƒ.Node;
            let pointer: number = _z * 3 + _x;
            console.log("pointer: " + pointer);
            anchor = _side.getChildByName(pointer.toString());
            return anchor;
        }
    }

}