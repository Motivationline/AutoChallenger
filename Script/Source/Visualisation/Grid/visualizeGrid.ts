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
            let tileGrid: ƒ.Node;
            tileGrid = new VisualizeTileGrid(new ƒ.Vector3(0, 0, 0));
            Provider.visualizer.addToScene(tileGrid);

            //set the positions of the entities in the grid
            this.grid.forEachElement((element, pos) => {
                if (!element) return;
                //get the entities positions from placeholders in the scene
                let home: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("home")[0];
                //let away: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("away")[0];
                let anchors = home.getChildren();
                /**Anchors are named from 0-8 */
                //TODO: Iterate through all anchors and set the Entities Position to the matching anchors Position
                element.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]).add(this.pos);
                this.addChild(element);
            });
        }
    }

}