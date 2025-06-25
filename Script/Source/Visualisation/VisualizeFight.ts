namespace Script {
    export interface IVisualizeFight {
        showGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
    }

    import ƒ = FudgeCore;

    export class VisualizeFightNull implements IVisualizeFight {
        #home: VisualizeGridNull;
        #away: VisualizeGridNull;
        constructor(_fight: Fight) {
            let awayGrid = new Grid<VisualizeEntity>();
            _fight.arena.away.forEachElement((entity, pos) => awayGrid.set(pos, entity?.getVisualizer()));
            this.#away = new VisualizeGridNull(awayGrid);
            let homeGrid = new Grid<VisualizeEntity>();
            _fight.arena.home.forEachElement((entity, pos) => homeGrid.set(pos, entity?.getVisualizer()));
            this.#home = new VisualizeGridNull(homeGrid);
        }

        async showGrid(): Promise<void> {
            let visualizer = Provider.visualizer;
            let tileGrid: ƒ.Node;
            tileGrid = new VisualizeTileGrid(new ƒ.Vector3(0, 0, 0));

            visualizer.addToScene(tileGrid);

            let grid: string[][] = [[, , , , , , ,], [], []];

            this.#home.grid.forEachElement((el, pos) => {
                if (!el) return;
                let entity = (<VisualizeEntity>el).getEntity();
                grid[pos[1]][2 - pos[0]] = `${entity.id}\n${entity.currentHealth} ♥️`;
                el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            })
            this.#away.grid.forEachElement((el, pos) => {
                if (!el) return;
                let entity = (<VisualizeEntity>el).getEntity();
                grid[pos[1]][pos[0] + 4] = `${entity.id}\n${entity.currentHealth} ♥️`;
                el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            })

            console.table(grid);
            //draw the 3D scene
            visualizer.drawScene();
        }

        async fightStart(): Promise<void> {
            console.log("Fight Start!");
            await this.showGrid();
        }

        async roundStart(): Promise<void> {
            console.log("Round Start!");
        }

        async roundEnd(): Promise<void> {
            await this.showGrid();
            console.log("Round End");
        }

        async fightEnd(): Promise<void> {
            console.log("Fight End!");
        }

    }
}