/// <reference path="Entities/VisualizeTarget.ts" />


namespace Script {
    import ƒ = FudgeCore;

    export class Visualizer {
        root: ƒ.Node;
        camera: ƒ.ComponentCamera;
        viewport: ƒ.Viewport;
        activeFight: VisualizeFight;
        #gui: VisualizeGUI;
        private entities: Map<IEntity, VisualizeEntity> = new Map();
        private fights: Map<Fight, VisualizeFight> = new Map();

        constructor() {
            this.root = new ƒ.Node("Root");
            new VisualizeTarget();
            this.getGUI();
            this.addEventListeners();
        }
        getEntity(_entity: IEntity): VisualizeEntity {
            if (!this.entities.has(_entity)) {
                this.createEntity(_entity);
            }
            return this.entities.get(_entity);
        }
        getFight(_fight: Fight): VisualizeFight {
            if (!this.fights.has(_fight)) {
                this.fights.set(_fight, new VisualizeFight(_fight));
            }
            return this.fights.get(_fight);
        }
        getGUI(): VisualizeGUI {
            if (!this.#gui) this.#gui = new VisualizeGUI();
            return this.#gui;
        }
        initializeScene(_viewport: ƒ.Viewport): void {
            this.viewport = _viewport;
            this.getGUI();

            console.log(this.root);

            let fightScene: ƒ.Graph = ƒ.Project.getResourcesByName("FightScene")[0] as ƒ.Graph;
            //attach the root node to the FightScene
            this.camera = fightScene.getChildByName("CameraRotator").getChildByName("Camera_Wrapper").getChildByName("Cam").getComponent(ƒ.ComponentCamera);
            fightScene.addChild(this.root);

            _viewport.initialize("Viewport", fightScene, this.camera, document.querySelector("canvas"));
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

        private createEntity(_entity: IEntity) {
            const entityVis = new VisualizeEntity(_entity);
            this.entities.set(_entity, entityVis);
        }

        private createEntityHandler = (_ev: FightEvent) => {
            const entity = _ev.target;
            if (!entity) return;
            this.createEntity(entity);
        }

        private fightPrepHandler = (_ev: FightEvent) => {
            const fight = _ev.detail.fight;
            if (!fight) return;
            let fightVis = this.getFight(fight);
            this.activeFight = fightVis;
        }

        addEventListeners() {
            EventBus.addEventListener(EVENT.ENTITY_CREATE, this.createEntityHandler);
            EventBus.addEventListener(EVENT.FIGHT_PREPARE, this.fightPrepHandler);
        }

        removeEventListeners() {
            EventBus.removeEventListener(EVENT.ENTITY_CREATE, this.createEntityHandler);
        }
    }
}
