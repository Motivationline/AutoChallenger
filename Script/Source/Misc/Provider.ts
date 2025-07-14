/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeGUI.ts" />


namespace Script {
    export class Provider {
        static #data: Data = new Data();
        static #visualizer: IVisualizer;

        static get data(): Readonly<Data> {
            return this.#data;
        }

        static get visualizer(): Readonly<IVisualizer> {
            return this.#visualizer;
        }

        static get GUI(): Readonly<VisualizeGUI> {
            return this.#visualizer.getGUI();
        }

        static setVisualizer(_vis?: IVisualizer): void {
            if (!_vis) {
                this.#visualizer = new VisualizerNull;
                return;
            }
            this.#visualizer = _vis;
        }
    }
}