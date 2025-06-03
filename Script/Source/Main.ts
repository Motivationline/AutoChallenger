/// <reference path="Data/Data.ts" />
/// <reference path="Fight/Fight.ts" />
/// <reference path="Misc/Provider.ts" />

namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  initProvider();

  async function initProvider() {
    await Provider.data.load();
    //TODO load correct visualizer here
    run();
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function run(){
    let eumlings: Grid<IEntity> = new Grid();
    eumlings.set([1,1], new Entity(Provider.data.getEntity("multipleAttacksOnlyOnePerRound"), Provider.visualizer));
    let fightData = Provider.data.fights[0];
    let fight = new Fight(fightData, eumlings);
    await fight.run();
  }
}