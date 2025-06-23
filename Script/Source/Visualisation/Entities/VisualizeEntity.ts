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

    export class VisualizeEntity extends ƒ.Node /*implements VisualizeEntity*/ {

        private entity: IEntity;
        //private grid: VisualizeGridNull;

        //create a mesh and material for the tile
        private static mesh: ƒ.Mesh = new ƒ.MeshCube("EntityMesh");
        private static material: ƒ.Material = new ƒ.Material("EntityMat", ƒ.ShaderLitTextured);

        private size: number = 0.5;

        constructor(_entity: IEntity) {
            super("entity");
            this.entity = _entity;

            const entityMesh = new ƒ.ComponentMesh(VisualizeEntity.mesh);
            const entityMat = new ƒ.ComponentMaterial(VisualizeEntity.material);
            this.addComponent(entityMesh);
            this.addComponent(entityMat);
            entityMesh.mtxPivot.scale(ƒ.Vector3.ONE(this.size));
            entityMat.clrPrimary.setCSS("white");

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.scaling = ƒ.Vector3.ONE(1.0);
        }

        async idle(): Promise<void> {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("white");
            await waitMS(200);
        }

        async attack(_attack: AttackData, _targets: IEntity[]): Promise<void> {
            console.log("entity visualizer null: attack", {attacker: this.entity, attack: _attack, targets: _targets});
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("blue");
            await waitMS(200);
        }

        async move(_move: MoveData): Promise<void> {
            //TODO: add movement logic here
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3());
            console.log("entity visualizer null: move", _move);
            await waitMS(200);
        }

        async hurt(_damage: number, _crit: boolean): Promise<void> {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("red");
            await waitMS(200);
        }

        async spell(_spell: SpellData, _targets: IEntity[]): Promise<void> {
            console.log("entity visualizer null: spell", {caster: this.entity, spell: _spell, targets: _targets});
            await waitMS(200);
        }

        async showPreview(): Promise<void> {
            console.log("entity visualizer null: show preview", this.entity);
            await waitMS(200);
        }

        async hidePreview(): Promise<void> {
            console.log("entity visualizer null: hide preview", this.entity);
            await waitMS(200);
        }

        async updateVisuals(): Promise<void> {
            // console.log("entity visualizer null: updateVisuals", this.entity);
            // await waitMS(200);
        }

        async resist(): Promise<void> {
            this.getComponent(ƒ.ComponentMaterial).clrPrimary.setCSS("gray");
            console.log("entity visualizer null: resisting", this.entity);
            await waitMS(200);
        }

        getEntity(): Readonly<IEntity> {
            return this.entity;
        }
    }
}