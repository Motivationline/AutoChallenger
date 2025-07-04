namespace Script {
    export interface IVisualizeFight {
        showGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
    }

    export class VisualizeFightNull implements IVisualizeFight {
        #home: IVisualizeGrid;
        #away: IVisualizeGrid;
        constructor(_fight: Fight) {
            let awayGrid = new Grid<VisualizeEntity>();
            _fight.arena.away.forEachElement((entity, pos) => {
                awayGrid.set(pos, new VisualizeEntity(entity))
            });
            this.#away = new IVisualizeGrid(awayGrid, "away");
            let homeGrid = new Grid<VisualizeEntity>();
            _fight.arena.home.forEachElement((entity, pos) => {
                homeGrid.set(pos, new VisualizeEntity(entity))
            });
            this.#home = new IVisualizeGrid(homeGrid, "home");

            Provider.visualizer.addToScene(this.#away);
            Provider.visualizer.addToScene(this.#home);
            Provider.visualizer.drawScene();
        }

        async showGrid(): Promise<void> {
            let visualizer = Provider.visualizer;

            // let grid: string[][] = [[, , , , , , ,], [], []];

            // this.#home.grid.forEachElement((el, pos) => {
            //     if (!el) return;
            //     let entity = (<VisualizeEntity>el).getEntity();
            //     grid[pos[1]][2 - pos[0]] = `${entity.id}\n${entity.currentHealth} ♥️`;
            //     el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            // })
            // this.#away.grid.forEachElement((el, pos) => {
            //     if (!el) return;
            //     let entity = (<VisualizeEntity>el).getEntity();
            //     grid[pos[1]][pos[0] + 4] = `${entity.id}\n${entity.currentHealth} ♥️`;
            //     el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            // })

            // console.table(grid);
            //draw the 3D scene
            visualizer.drawScene();
        }
        async nukeGrid(): Promise<void> {
            this.#home.grid.forEachElement((el) =>{
                if (!el) return;
                el.updateVisuals();
            });
            this.#away.grid.forEachElement((el) =>{
                if (!el) return;
                el.updateVisuals();
            });
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
            // TODO @Björn clean up visible entities
            await this.nukeGrid();
            console.log("Fight End!");
        }

    }
}