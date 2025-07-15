/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeGUI.ts" />


namespace Script {
    export class Provider {
        static #data: Data = new Data();
        static #visualizer: Visualizer;

        static get data(): Readonly<Data> {
            return this.#data;
        }

        static get visualizer(): Readonly<Visualizer> {
            return this.#visualizer;
        }

        static get GUI(): Readonly<VisualizeGUI> {
            return this.#visualizer.getGUI();
        }

        static setVisualizer(_vis?: Visualizer): void {
            if (!_vis) {
                this.#visualizer = new Visualizer;
                return;
            }
            this.#visualizer = _vis;
        }
    }
}