/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />

namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  const root: ƒ.Node = new ƒ.Node("Root");

  //let tile: Tile;
  let grid: VisualizeGrid;

  async function initProvider() {
    await Provider.data.load(); // TODO wie funktioniert das?
    //TODO load correct visualizer here
    run();
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    initProvider();

    //tile = new Tile("Tile", 1, new ƒ.Vector3(0, 0, 0));
    grid = new VisualizeGrid(new ƒ.Vector3(0, 0, 0));

    root.addChild(grid);
    console.log(root);

    //setup Camera view
    const camera = new ƒ.ComponentCamera();
    console.log(camera);
    camera.mtxPivot.translateZ(-10);
    camera.mtxPivot.translateY(5);
    camera.mtxPivot.rotateX(25);

    //initialize the Viewport
    viewport.initialize("Viewport", root, camera, document.querySelector("canvas"));
    viewport.draw();
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function run() {
    const eumlingData = Provider.data.fights[0].entities;
    // rotate entities in first fight around because they're meant to be testing eumlings for now
    // TODO: remove this once this sort of testing is obsolete.
    [eumlingData[0][0], eumlingData[0][2]] = [eumlingData[0][2], eumlingData[0][0]];  // TODO Wie funktioniert das?
    [eumlingData[1][0], eumlingData[1][2]] = [eumlingData[1][2], eumlingData[1][0]];
    [eumlingData[2][0], eumlingData[2][2]] = [eumlingData[2][2], eumlingData[2][0]];

    let eumlings: Grid<IEntity> = initEntitiesInGrid(eumlingData, Entity);
    // let tmp = eumlings.get([0, 0]);
    // eumlings.set([0, 0], eumlings.get([2, 0]));
    // eumlings.set([2, 0], tmp);
    // tmp = eumlings.get([0, 0]);
    // eumlings.set([0, 0], eumlings.get([2, 0]));
    // eumlings.set([2, 0], tmp);
    // tmp = eumlings.get([0, 0]);
    // eumlings.set([0, 0], eumlings.get([2, 0]));
    // eumlings.set([2, 0], tmp);

    let fightData = Provider.data.fights[1];
    let fight = new Fight(fightData, eumlings);
    console.log("Rounds: " + fight.getRounds());
    await fight.run();
  }
}