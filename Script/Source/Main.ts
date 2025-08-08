/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />
/// <reference path="Visualisation/UI/VisualizeGUI.ts"/>

namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  let visualizer: Readonly<Visualizer>;
  export let viewport: ƒ.Viewport;

  document.addEventListener("click", startLoading, { once: true })
  Provider.setVisualizer();

  export async function startLoading() {
    if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
    new MusicManager();

    Provider.GUI.addUI("loading");

    viewport = await loadResourcesAndInitViewport(document.getElementById("GameCanvas") as HTMLCanvasElement);

    await initProvider();

    Provider.GUI.replaceUI("mainMenu");

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function initProvider() {
    await Provider.data.load();
    visualizer = Provider.visualizer;
    visualizer.initializeScene(viewport);
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    // ƒ.AudioManager.default.update();
  }

  export async function run() {
    const run = new Run();
    run.start();
  }
}