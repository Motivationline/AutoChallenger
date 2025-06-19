namespace Script {
    import ƒ = FudgeCore;
    export interface VisualizeEntity {
        idle(): Promise<void>;
        attack(_attack: AttackData, _targets: IEntity[]): Promise<void>;
        move(_move: MoveData): Promise<void>;
        hurt(_damage: number, _crit: boolean): Promise<void>;
        resist(): Promise<void>;
        spell(_spell: SpellData, _targets: IEntity[]): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): void;
    }

    export class VisualizeEntity extends ƒ.Node implements VisualizeEntity {

        private entity: IEntity;
        private grid: VisualizeGrid = 

        //TODO: read position from Fights.ts
        //TODO: attach to Grid


        constructor(_entity: IEntity) {
            super(_entity.id);
            this.entity = _entity;
            
        }

        // idle(): Promise<void> {

        // }
    }
}