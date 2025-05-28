namespace Script {
    export interface IVisualizer {
        getEntity(_entity: iEntity): IVisualizeEntity;
    }


    export class VisualizerNull implements IVisualizer {
        getEntity(_entity: iEntity): IVisualizeEntity {
            return new VisualizeEntityNull(_entity);
        }
    }
}
