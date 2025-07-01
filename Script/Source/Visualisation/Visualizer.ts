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
            this.root = new ƒ.Node("Root");
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
            let HUD: VisualizeHUD = new VisualizeHUD();
            HUD.sayHello();// TODO remove this!

            console.log(this.root);

            let FigthScene: ƒ.Graph = ƒ.Project.getResourcesByName("FightScene")[0] as ƒ.Graph;
            //attach the root node to the FightScene
            //TODO: Fight Scene can also be added to empty scene
            this.camera = FigthScene.getChildByName("Camera_Wrapper").getChildByName("Cam").getComponent(ƒ.ComponentCamera);
            FigthScene.addChild(this.root);

            _viewport.initialize("Viewport", FigthScene, this.camera, document.querySelector("canvas"));
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
