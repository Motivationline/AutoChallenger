namespace Script {
    export interface IVisualizer {
        getEntity(_entity: IEntity): VisualizeEntity;
        getFight(_fight: Fight): IVisualizeFight;
        getHUD(): VisualizeHUD;
    }


    export class VisualizerNull implements IVisualizer {
        getEntity(_entity: IEntity): VisualizeEntity {
            return new VisualizeEntity(_entity);
        }
        getFight(_fight: Fight): IVisualizeFight {
            return new VisualizeFightNull(_fight);
        }
        getHUD(): VisualizeHUD {
            return new VisualizeHUD();
        }
        
    }
}
