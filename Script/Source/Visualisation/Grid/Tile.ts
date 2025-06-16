namespace Script {
    import ƒ = FudgeCore;

    export class Tile extends ƒ.Node {
        //create a mesh and material for the tile
        private static mesh : ƒ.Mesh = new ƒ.MeshQuad("TileMesh");
        private static material : ƒ.Material = new ƒ.Material("TileMaterial", ƒ.ShaderFlat);

        private size : number;
        private pos : ƒ.Vector3;

        constructor(_name : string, _size: number, _pos: ƒ.Vector3){
            super(_name);
            this.size = _size;
            this.pos = _pos;

            const tileMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(Tile.mesh);
            tileMesh.mtxPivot.scale(new ƒ.Vector3(this.size, 1, this.size));
            tileMesh.mtxPivot.translate(this.pos);

            const tileMat: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Tile.material);
            tileMat.clrPrimary.setCSS("white");

            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(tileMesh);
            this.addComponent(tileMat);
        }
    }
}