namespace Script {
    export interface IVisualizer {
        getEntity(_entity: IEntity): IVisualizeEntity;
    }


    export class VisualizerNull implements IVisualizer {
        getEntity(_entity: IEntity): IVisualizeEntity {
            return new VisualizeEntityNull(_entity);
        }
    }
}
