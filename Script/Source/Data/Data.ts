/// <reference path="Entities.ts" />
/// <reference path="Fights.ts" />


namespace Script {

    export interface DataData {
        fights: FightData[],
        entities: EntityData[],
        entityMap: { [id: string]: EntityData },
    }

    export class Data {
        private data: Partial<DataData> = {};
        public async load() {
            this.data.fights = DataContent.fights;
            this.data.entities = DataContent.entities;

            // copy to map for quicker access through getEntity
            this.data.entityMap = {};
            for (let entity of this.data.entities) {
                this.data.entityMap[entity.id] = entity;
            }

            // resolve inheritance
            for (let i: number = 0; i < this.data.entities.length; i++) {
                const entity = this.data.entities[i];
                if (entity.parent) {
                    let newEntity = this.resolveParent(entity);
                    this.data.entities[i] = newEntity;
                    this.data.entityMap[entity.id] = newEntity;
                }
            }
        }

        public get fights(): readonly FightData[] {
            return this.data.fights;
        }
        public get entities(): readonly EntityData[] {
            return this.data.entities;
        }

        public getEntity(_id: string): Readonly<EntityData> | undefined {
            return this.data.entityMap[_id];
        }
        private resolveParent(_entity: EntityData): EntityData | undefined {
            if (!_entity.parent) return _entity;
            let parent = this.getEntity(_entity.parent);
            if (!parent) return _entity;
            return { ...this.resolveParent(parent), ..._entity };
        }
    }
}