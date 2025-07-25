// namespace Script {
//     export interface IVisualizeEntity {
//         attack(_attack: AttackData, _targets: IEntity[]): Promise<void>;
//         move(_move: MoveData): Promise<void>;
//         hurt(_damage: number, _crit: boolean): Promise<void>;
//         resist(): Promise<void>;
//         spell(_spell: SpellData, _targets: IEntity[]): Promise<void>;
//         showPreview(): Promise<void>;
//         hidePreview(): Promise<void>;
//         /** Called at the end of the fight to "reset" the visuals in case something went wrong. */
//         updateVisuals(): void;
//     }

//     export class VisualizeEntityNull implements IVisualizeEntity {
//         #entity: IEntity;
//         constructor(_entity: IEntity) { this.#entity = _entity; }
//         async attack(_attack: AttackData, _targets: IEntity[]): Promise<void> {
//             console.log("entity visualizer null: attack", {attacker: this.#entity, attack: _attack, targets: _targets});
//             await waitMS(200);
//         }
//         async move(_move: MoveData): Promise<void> {
//             console.log("entity visualizer null: move", _move);
//             await waitMS(200);
//         }
//         async hurt(_damage: number, _crit: boolean): Promise<void> {
//             console.log("entity visualizer null: hurt", {hurtEntity: this.#entity, damage: _damage, wasCrit: _crit});
//             await waitMS(200);
//         }
//         async spell(_spell: SpellData, _targets: IEntity[]): Promise<void> {
//             console.log("entity visualizer null: spell", {caster: this.#entity, spell: _spell, targets: _targets});
//             await waitMS(200);
//         }
//         async showPreview(): Promise<void> {
//             console.log("entity visualizer null: show preview", this.#entity);
//             await waitMS(200);
//         }
//         async hidePreview(): Promise<void> {
//             console.log("entity visualizer null: hide preview", this.#entity);
//             await waitMS(200);
//         }
//         async updateVisuals(): Promise<void> {
//             // console.log("entity visualizer null: updateVisuals", this.#entity);
//             // await waitMS(200);
//         }
//         async resist(): Promise<void> {
//             console.log("entity visualizer null: resisting", this.#entity);
//             await waitMS(200);    
//         }

//         getEntity(): Readonly<IEntity> {
//             return this.#entity;
//         }
//     }
// }