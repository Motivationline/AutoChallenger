namespace Script {
    import ƒ = FudgeCore;

    export class VisualizeTile extends ƒ.Node {
        //create a mesh and material for the tile
        private static mesh : ƒ.Mesh = new ƒ.MeshCube("TileMesh");
        private static material : ƒ.Material = new ƒ.Material("TileMat", ƒ.ShaderLitTextured);

        private size : number;
        private pos : ƒ.Vector3;

        constructor(_name : string, _size: number, _pos: ƒ.Vector3){
            super(_name);
            this.size = _size;
            this.pos = _pos;

            const tileMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(VisualizeTile.mesh);
            tileMesh.mtxPivot.scale(new ƒ.Vector3(this.size, 0.001, this.size));
            tileMesh.mtxPivot.translate(this.pos);
            tileMesh.mtxPivot.rotateZ(90);

            //const sphere: ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshSphere("Tile"));

            const tileMat: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(VisualizeTile.material);
            tileMat.clrPrimary.setCSS("white");

            this.addComponent(tileMesh);
            this.addComponent(tileMat);
            this.addComponent(new ƒ.ComponentTransform());
        }
    }
}