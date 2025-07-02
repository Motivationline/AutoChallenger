namespace Script {

    //Visualize the Entities in the Grid
    //Instances the Entities in the correct grid Position

    import ƒ = FudgeCore;

    export class IVisualizeGrid extends ƒ.Node {

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
                if (!element) return;

                let visSide: ƒ.Node;

                //get Placeholders from scene
                if (this.side === "away") {
                    visSide = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
                } else if (this.side === "home") {
                    visSide = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
                }

                //let away: ƒ.Node = Provider.visualizer.getGraph().getChildrenByName("away")[0];

                /**Anchors are named from 0-8 */
                let anchor: ƒ.Node = this.getAnchor(visSide, pos[0], pos[1]);
                //get the Positions from the placeholders and translate the entities to it
                let position: ƒ.Vector3 = anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;
                console.log("position: " + position);
                
                element.mtxLocal.translation = new ƒ.Vector3(position.x, position.y, position.z);
                console.log("element position: " + element.mtxLocal.translation);
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