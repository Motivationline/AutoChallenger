/// <reference path="../Visualisation/Visualizer.ts" />

namespace Script {
    export class Provider {
        static #data: Data = new Data();
        static #visualizer: IVisualizer = new VisualizerNull();

        static get data(): Readonly<Data> {
            return this.#data;
        }

        static get visualizer(): Readonly<IVisualizer> {
            return this.#visualizer;
        }

        static setVisualizer(_vis: IVisualizer): void {
            if(!_vis) {
                this.#visualizer = new VisualizerNull;
                return;
            }
            this.#visualizer = _vis;
        }
    }
}