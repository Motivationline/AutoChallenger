namespace Script {

    import ƒ = FudgeCore;

    class IVisualizeGrid extends ƒ.Node{
        home: ƒ.Node;
        away: ƒ.Node;

        grid: Grid<VisualizeEntity>;
        tiles: Grid<VisualizeTile>;

        pos: ƒ.Vector3;

        constructor(_grid: Grid<VisualizeEntity>, _pos: ƒ.Vector3){
            super("VisualizeGrid");
            this.grid = _grid;
            this.pos = _pos;

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translate(this.pos);
        }
    }

}