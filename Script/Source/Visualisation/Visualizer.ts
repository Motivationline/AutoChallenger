namespace Script {
    export interface IVisualizer {
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
        getHUD(): VisualizeHUD;
        addToScene(_el: ƒ.Node):void;
        getCamera(): ƒ.ComponentCamera;
        getRoot(): ƒ.Node;
        initializeScene(_viewport: ƒ.Viewport): void;
        drawScene(): void;
        getGraph(): ƒ.Graph;
    }

    import ƒ = FudgeCore;

    export class VisualizerNull implements IVisualizer {
        root: ƒ.Node;
        camera: ƒ.ComponentCamera;
        viewport: ƒ.Viewport;

        constructor() {
            let FigthScene: ƒ.Graph = ƒ.Project.getResourcesByName("FightScene")[0] as ƒ.Graph;
            this.viewport.setBranch(FigthScene);
            this.root = new ƒ.Node("Root");
            //attach the root node to the FightScene
            //TODO: Fight Scene can also be added to empty scene
            FigthScene.addChild(this.root);

            this.camera = new ƒ.ComponentCamera();
        }
        getEntity(_entity: IEntity): VisualizeEntity {
            return new VisualizeEntity(_entity);
        }
        getFight(_fight: Fight): IVisualizeFight {
            return new VisualizeFightNull(_fight);
        }
        getHUD(): VisualizeHUD {
            return new VisualizeHUD();
        }
        initializeScene(_viewport: ƒ.Viewport): void {
            this.viewport = _viewport;
            //let tile: Tile;
            let grid: VisualizeTileGrid;
            let HUD: VisualizeHUD = new VisualizeHUD();
            HUD.sayHello();// TODO remove this!

            //tile = new Tile("Tile", 1, new ƒ.Vector3(0, 0, 0));
            grid = new VisualizeTileGrid(new ƒ.Vector3(0, 0, 0));

            this.root.addChild(grid);

            console.log(this.root);

            //testing camera orientation
            this.camera.mtxPivot.translateZ(-10);
            this.camera.mtxPivot.translateY(6);
            this.camera.mtxPivot.rotateX(25);

            _viewport.initialize("Viewport", this.root, this.camera, document.querySelector("canvas"));
            _viewport.draw();
        }
        addToScene(_el: ƒ.Node): void {
            this.root.addChild(_el);
            console.log("Root: " + this.root);
        }
        getCamera(): ƒ.ComponentCamera {
            return this.camera;
        }
        getRoot(): ƒ.Node {
            return this.root;
        }
        getGraph(): ƒ.Graph {
            return this.viewport.getBranch() as ƒ.Graph;
        }
        drawScene(): void {
            this.viewport.draw();
        }
    }
}
