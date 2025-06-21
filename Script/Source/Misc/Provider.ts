/// <reference path="../Visualisation/Visualizer.ts" />
/// <reference path="../Visualisation/UI/VisualizeHUD.ts" />


namespace Script {
    export class Provider {
        static #data: Data = new Data();
        static #visualizer: IVisualizer = new VisualizerNull();
        static #HUD: VisualizeHUD = new VisualizeHUD();

        static get data(): Readonly<Data> {
            return this.#data;
        }

        static get visualizer(): Readonly<IVisualizer> {
            return this.#visualizer;
        }

        static get HUD(): Readonly<VisualizeHUD> {
            return this.#HUD;
        }

        static setVisualizer(_vis: IVisualizer): void {
            if (!_vis) {
                this.#visualizer = new VisualizerNull;
                return;
            }
            this.#visualizer = _vis;
        }
    }
}