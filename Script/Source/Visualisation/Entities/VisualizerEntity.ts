namespace Script {
    export interface IVisualizeEntity {
        attack(_attack: Attack): Promise<void>;
        move(): Promise<void>;
        hurt(): Promise<void>;
        spell(_spell: Spell): Promise<void>;
        showPreview(): Promise<void>;
        hidePreview(): Promise<void>;
        /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
        updateVisuals(): Promise<void>;
    }

    export class VisualizeEntityNull implements IVisualizeEntity {
        #entity: iEntity;
        constructor(_entity: iEntity) { this.#entity = _entity; }
        async attack(): Promise<void> {
            console.log("entity visualizer null: attack", this.#entity);
            await waitMS(200);
        }
        async move(): Promise<void> {
            console.log("entity visualizer null: move", this.#entity);
            await waitMS(200);
        }
        async hurt(): Promise<void> {
            console.log("entity visualizer null: hurt", this.#entity);
            await waitMS(200);
        }
        async spell(): Promise<void> {
            console.log("entity visualizer null: buff", this.#entity);
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