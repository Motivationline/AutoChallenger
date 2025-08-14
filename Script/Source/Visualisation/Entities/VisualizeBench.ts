namespace Script {
    import ƒ = FudgeCore;
    export class VisualizeBench extends ƒ.Component {
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

        }

        #entities: Set<VisualizeEntity> = new Set();
        addEntity(_entity: VisualizeEntity) {
            this.#entities.add(_entity)
            this.arrangeEntities();
            this.node.addChild(_entity);
            _entity.activate(true);
        }

        hasEntity(_entity: VisualizeEntity): boolean {
            return this.#entities.has(_entity);
        }
        
        removeEntity(_entity: VisualizeEntity) {
            this.#entities.delete(_entity);
            this.arrangeEntities();
            this.node.removeChild(_entity);
            _entity.activate(false);
        }

        clear() {
            const arr = Array.from(this.#entities);
            for (let entity of arr) {
                this.removeEntity(entity);
            }
        }

        private arrangeEntities() {
            const distanceBetweenEntities = 1;
            const arr = Array.from(this.#entities);
            for (let i: number = 0; i < arr.length; i++) {
                const entity = arr[i];
                const newX: number = (i - (arr.length - 1) / 2) * distanceBetweenEntities;
                entity.mtxLocal.translation = new ƒ.Vector3(newX);
            }
        }

    }
}