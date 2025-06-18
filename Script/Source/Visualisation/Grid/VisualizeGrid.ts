namespace Script {

    import ƒ = FudgeCore;

    export class VisualizeGrid extends ƒ.Node{

        private tiles: number;
        private tileSize: number;
        private spacing: number;
        private offset: number;
        private position: ƒ.Vector3;

        constructor(_position: ƒ.Vector3) {
            super("VisualizeGrid");
            this.position = _position;
            this.tiles = 9; //3x3
            this.tileSize = 1;
            this.spacing = 0.2; //large values = smaller spacing
            this.offset = 0.5;

            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translate(this.position);
            this.generateGrid();
        }

        //create a grid with 2 Sides: home | away
        //each having a 3x3 grid of tiles
        private generateGrid(): void{

            let home: ƒ.Node = new ƒ.Node("home");
            let away: ƒ.Node = new ƒ.Node("away");
            home.addComponent(new ƒ.ComponentTransform);
            away.addComponent(new ƒ.ComponentTransform);

            //create the tile grid for each side
            this.layoutGrid(home, 1);
            this.layoutGrid(away, -1);

            //add the sides as children to the grid Object
            this.addChild(home);
            this.addChild(away);
        }

        //TODO: consider world position or relative position?
        getTilePosition(_index: number, _side: string): ƒ.Vector3 {
            let i: number = _index;
            if (_side === "home") {
                let x = i % 3;
                let z = Math.floor(i / 3);
                return new ƒ.Vector3(x, 0, z);
            } else if (_side === "away") {
                let x = -(i % 3);
                let z = Math.floor(i / 3);
                return new ƒ.Vector3(x, 0, z);
            } else {
                throw new Error("Invalide side. Expected 'home' or 'away'.");
            }
        }

        //Layout the tiles in a grid with a given direction and add them as childs to the given parent node
        private layoutGrid(_parent: ƒ.Node, direction: number = 1) {
            for (let i = 0; i < this.tiles; i++) {
                let x = i % 3;
                let z = Math.floor(i / 3);
                let tilePos = new ƒ.Vector3(direction * (this.offset + x * (this.tileSize - this.spacing)), 0, z * (this.tileSize - this.spacing));
                let tile: Tile = new Tile(`Tile_${i}: ${x}, ${z}`, this.tileSize, tilePos);
                tile.getComponent(ƒ.ComponentTransform).mtxLocal.translate(tilePos);
                _parent.addChild(tile);
            }
        }
    }

}