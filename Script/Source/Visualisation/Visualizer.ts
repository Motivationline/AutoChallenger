namespace Script {
    export interface IVisualizer {
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
        getHUD(): VisualizeHUD;
        addToScene(_el: ƒ.Node):void;
        getCamera(): ƒ.ComponentCamera;
        getRoot(): ƒ.Node;
        initializeScene(_viewport: ƒ.Viewport): ƒ.Viewport;
    }

    import ƒ = FudgeCore;

    export class VisualizerNull implements IVisualizer {
        root: ƒ.Node;
        camera: ƒ.ComponentCamera;

        constructor() {
            this.root = new ƒ.Node("Root");
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
        initializeScene(_viewport: ƒ.Viewport): ƒ.Viewport {
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
            return _viewport;
        }
        addToScene(_el: ƒ.Node): void {
            this.root.addChild(_el);
        }
        getCamera(): ƒ.ComponentCamera {
            return this.camera;
        }
        getRoot(): ƒ.Node {
            return this.root;
        }
    }
}
