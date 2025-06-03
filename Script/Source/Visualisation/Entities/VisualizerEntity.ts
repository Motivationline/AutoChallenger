namespace Script {
    export interface IVisualizeEntity {
        attack(_attack: AttackData): Promise<void>;
        move(_move: MoveData): Promise<void>;
        hurt(): Promise<void>;
        spell(_spell: SpellData): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): void;
    }

    export class VisualizeEntityNull implements IVisualizeEntity {
        #entity: IEntity;
        constructor(_entity: IEntity) { this.#entity = _entity; }
        async attack(_attack: AttackData): Promise<void> {
            console.log("entity visualizer null: attack", _attack);
            await waitMS(200);
        }
        async move(_move: MoveData): Promise<void> {
            console.log("entity visualizer null: move", _move);
            await waitMS(200);
        }
        async hurt(): Promise<void> {
            console.log("entity visualizer null: hurt", this.#entity);
            await waitMS(200);
        }
        async spell(_spell: SpellData): Promise<void> {
            console.log("entity visualizer null: spell", _spell);
            await waitMS(200);
        }
        async showPreview(): Promise<void> {
            console.log("entity visualizer null: show preview", this.#entity);
            await waitMS(200);
        }
        async hidePreview(): Promise<void> {
            console.log("entity visualizer null: hide preview", this.#entity);
            await waitMS(200);
        }
        async updateVisuals(): Promise<void> {
            console.log("entity visualizer null: updateVisuals", this.#entity);
            await waitMS(200);
        }

    }
}