/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />
/// <reference path="Visualisation/UI/VisualizeGUI.ts"/>

namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  ƒ.Debug.info("Main Program Template running!");
  let visualizer: IVisualizer;
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  async function initProvider() {
    if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
    await Provider.data.load();
    //TODO load correct visualizer here
    run();
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    initProvider();
    visualizer = Provider.visualizer;
    visualizer.initializeScene(viewport);
    visualizer.drawScene();
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function run() {
    // const eumlingData = Provider.data.fights[0].entities;
    // rotate entities in first fight around because they're meant to be testing eumlings for now
    // TODO: remove this once this sort of testing is obsolete.
    // [eumlingData[0][0], eumlingData[0][2]] = [eumlingData[0][2], eumlingData[0][0]];
    // [eumlingData[1][0], eumlingData[1][2]] = [eumlingData[1][2], eumlingData[1][0]];
    // [eumlingData[2][0], eumlingData[2][2]] = [eumlingData[2][2], eumlingData[2][0]];

    // let eumlings: Grid<IEntity> = initEntitiesInGrid(eumlingData, Entity);
    // eumlings.forEachElement((eumling) => {
    //   let visualizer = new VisualizeEntity(eumling);
    //   root.addChild(visualizer);
    // });
    // console.log("Root: ", root);
    // viewport.draw();

    // let tmp = eumlings.get([0, 0]);
    // eumlings.set([0, 0], eumlings.get([2, 0]));
    // eumlings.set([2, 0], tmp);
    // tmp = eumlings.get([0, 0]);
    // eumlings.set([0, 0], eumlings.get([2, 0]));
    // eumlings.set([2, 0], tmp);
    // tmp = eumlings.get([0, 0]);
    // eumlings.set([0, 0], eumlings.get([2, 0]));
    // eumlings.set([2, 0], tmp);

    // visualizer.drawScene();
    // let fightData = Provider.data.fights[3];
    // let fight = new Fight(fightData, eumlings);
    // console.log("Rounds: " + fight.getRounds());
    // await fight.run();

    const run = new Run();
    await run.start();
    console.log("run over");
  }
}