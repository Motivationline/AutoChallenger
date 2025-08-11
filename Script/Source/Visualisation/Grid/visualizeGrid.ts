namespace Script {

    //Visualize the Entities in the Grid
    //Instances the Entities in the correct grid Position

    import ƒ = FudgeCore;

    export class VisualizeGrid extends ƒ.Node {

        grid: Grid<VisualizeEntity>;

        side: string;
        sideNode: ƒ.Node;

        constructor(_grid: Grid<VisualizeEntity>, _side: string) {
            super("VisualizeGrid");
            this.grid = _grid;
            if (_side === "home" || "away") {
                this.side = _side;
            } else {
                throw new Error("Use home or away for the side parameter");
            }

            if (this.side === "away") {
                this.sideNode = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("away");
            } else if (this.side === "home") {
                this.sideNode = Provider.visualizer.getGraph().getChildByName("Grids").getChildByName("home");
            }

            this.addComponent(new ƒ.ComponentTransform());
            //set the positions of the entities in the grid
            this.grid.forEachElement((element, pos) => {
                this.addEntityToGrid(element, pos, false);
            });
            this.registerEventListeners();
        }

        addEntityToGrid(_entity: VisualizeEntity, _pos: Position, _removeExisting: boolean = true, _anchor?: ƒ.Node) {
            if (Grid.outOfBounds(_pos)) return;
            if (_removeExisting) {
                this.removeEntityFromGrid(_pos, false);
            }
            // remove this entity if it's already somewhere in the grid
            this.grid.forEachElement((entity, pos) => {
                if (entity === _entity) this.removeEntityFromGrid(pos, false);
            });

            // if (!_anchor) {
            //     /**Anchors are named from 0-8 */
            //     _anchor = this.getAnchor(_pos[0], _pos[1]);
            // }

            //get the Positions from the placeholders and translate the entities to it
            this.moveEntityToAnchor(_entity, _pos);
            this.addChild(_entity);
            this.grid.set(_pos, _entity, true);
            
        }

        removeEntityFromGrid(_pos: Position, _removeListeners: boolean) {
            if (Grid.outOfBounds(_pos)) return;
            let elementToRemove = this.grid.get(_pos);
            if (!elementToRemove) return;
            this.grid.remove(_pos);
            this.removeChild(elementToRemove);
            if (_removeListeners)
                elementToRemove.removeEventListeners();
        }

        moveEntityToAnchor(_entity: VisualizeEntity, position: Position) {
            let _anchor = this.getAnchor(position[0], position[1]);

            //get the Positions from the placeholders and translate the entity to it
            let pos3: ƒ.Vector3 = _anchor.getComponent(ƒ.ComponentTransform).mtxLocal.translation;
            console.log(_entity);
            _entity.mtxLocal.translation = pos3.clone;
            this.grid.set(position, _entity, true);
        }

        getAnchor(_x: number, _z: number): ƒ.Node {
            let anchor: ƒ.Node;
            let pointer: number = _z * 3 + _x;
            console.log("pointer: " + pointer);
            anchor = this.sideNode.getChildByName(pointer.toString());
            return anchor;
        }

        nuke() {
            this.grid.forEachElement((_el, pos) => {
                this.removeEntityFromGrid(pos, true);
            })
        }

        // @Björn auch hier das problem dass du den Bezug zu "this" verlierst. 
        // Lambda Funktionsschreibweise (s. VisualizeEntity.updatePosition Kommentar) ist der Weg das zu reparieren.
        //TODO: check why move is not being called
        async move(_ev: FightEvent) {
            console.log("CALLED MOVE FUNCTION");
            //gets the moving entity and moves it
            console.log("Vis Grid: ", this);
            console.log("try to get moved Entity at Position: ",  _ev.detail.oldPosition, ", moving to: ", _ev.detail.position)
            this.moveEntityToAnchor(this.grid.get(_ev.detail.oldPosition), _ev.detail.position);
        }

        // updatePosition = async (_ev: FightEvent) => {
        //     console.log("RECIEVD MOVE EVENT!!!");
        //     await this.move(_ev);
        // }

        registerEventListeners(): void {
            EventBus.addEventListener(EVENT.ENTITY_MOVED, this.eventListener);
            EventBus.addEventListener(EVENT.RUN_END, this.eventListener);
        }

        removeEventListeners(): void {
            EventBus.removeEventListener(EVENT.ENTITY_MOVED, this.eventListener);
            EventBus.removeEventListener(EVENT.RUN_END, this.eventListener);
        }

        eventListener = async (_ev: FightEvent) => {
            await this.handleEvent(_ev);
        }

        async handleEvent(_ev: FightEvent) {

            // this entity is doing something
            switch (_ev.type) {
                case EVENT.ENTITY_MOVED: {
                    console.log("RECIEVD MOVE EVENT!!!");
                    await this.move(_ev);
                    break;
                }
                case EVENT.RUN_END: {
                    this.removeEventListeners;
                }
            }
        }

    }

}