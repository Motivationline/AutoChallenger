namespace Script {
    export interface IVisualizer {
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
        getHUD(): VisualizeGUI;
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
            //TODO: trigger this after the HTML is loaded
            //this.hideUI();
        }
        getEntity(_entity: IEntity): VisualizeEntity {
            return new VisualizeEntity(_entity);
        }
        getFight(_fight: Fight): IVisualizeFight {
            return new VisualizeFightNull(_fight);
        }
        getHUD(): VisualizeGUI {
            return new VisualizeGUI();
        }
        initializeScene(_viewport: ƒ.Viewport): void {
            this.viewport = _viewport;
            let HUD: VisualizeGUI = new VisualizeGUI();

            console.log(this.root);

            let FigthScene: ƒ.Graph = ƒ.Project.getResourcesByName("FightScene")[0] as ƒ.Graph;
            //attach the root node to the FightScene
            this.camera = FigthScene.getChildByName("CameraRotator").getChildByName("Camera_Wrapper").getChildByName("Cam").getComponent(ƒ.ComponentCamera);
            FigthScene.addChild(this.root);

            _viewport.initialize("Viewport", FigthScene, this.camera, document.querySelector("canvas"));
            _viewport.draw();
        }
        addToScene(_el: ƒ.Node): void {
            this.root.addChild(_el);
            //console.log("Root: " + this.root);
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
        hideUI(): void{
            document.getElementById("#Fight").hidden = true;
            document.getElementById("#Menu").hidden = true;
            document.getElementById("#Map").hidden = true;
            document.getElementById("#Shop").hidden = true;
        }

        //first test switching through the differnet Menus
        private fightStart = async (_ev: FightEvent) => {
            document.getElementById("#Fight").hidden = false;
            document.getElementById("#Menu").hidden = true;
            document.getElementById("#Map").hidden = true;
            document.getElementById("#Shop").hidden = true;
        }

        addFightListeners() {
            EventBus.addEventListener(EVENT.FIGHT_START, this.fightStart);
        }
    }
}
