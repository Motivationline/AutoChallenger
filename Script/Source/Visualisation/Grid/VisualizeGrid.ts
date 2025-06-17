namespace Script{

    import ƒ = FudgeCore;

    class VisualizeGrid{

        private pattern : ƒ.Vector2;
        private tileSize : number;
        private spacing : number;
        private offset : number;
        private position : ƒ.Vector3;

        constructor(_position : ƒ.Vector3){
            this.position = _position;
            this.pattern = new ƒ.Vector2(3, 3);
            this.tileSize = 1;
            this.spacing = 0.1;
            this.offset = 0.2;
        }

        generateGrid(){
            let grid : ƒ.Node = new ƒ.Node("grid");
            grid.addComponent(new ƒ.ComponentTransform);
            grid.getComponent(ƒ.ComponentTransform).mtxLocal.translate(this.position);

            let home : ƒ.Node = new ƒ.Node("home");
            let away: ƒ.Node = new ƒ.Node("away");
            home.addComponent(new ƒ.ComponentTransform);
            away.addComponent(new ƒ.ComponentTransform);
            return grid
        }

        getGridPosition(_x: number, _y: number){

        }
    }

}