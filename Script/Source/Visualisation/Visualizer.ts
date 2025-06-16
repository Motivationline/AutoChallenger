namespace Script {
    export interface IVisualizer {
        getEntity(_entity: IEntity): IVisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
    }


    export class VisualizerNull implements IVisualizer {
        getEntity(_entity: IEntity): IVisualizeEntity {
            return new VisualizeEntityNull(_entity);
        }
        getFight(_fight: Fight): IVisualizeFight {
            return new VisualizeFightNull(_fight);
        }
        
    }
}
