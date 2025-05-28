namespace Script {
    export class Fight {
        rounds: number;
        arena: Arena;

        constructor(_fight: iFight) {
            this.rounds = _fight.rounds;
            this.arena = {
                away: Grid.EMPTY(),
                home: Grid.EMPTY(),
            }
            let data = Provider.data;
            Utils.forEachElement(_fight.entities, (entityId, pos) => {
                if(!entityId) return;
                this.arena.away[pos[0]][pos[1]] = new Entity(data.getEntity(entityId), Provider.visualizer);
            });
        }
    }
}