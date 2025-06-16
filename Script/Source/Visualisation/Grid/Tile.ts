namespace Script {
    import ƒ = FudgeCore;

    export class Tile extends ƒ.Node {
        private static mesh : ƒ.Mesh = new ƒ.MeshQuad("TileMesh");
        private static material : ƒ.Material = new ƒ.Material("TileMaterial", ƒ.ShaderLitTextured);

        private size : number;
        private pos : ƒ.Vector3;

        constructor(_name : string, _size: number, _pos: ƒ.Vector3){
            super(_name);
            this.size = _size;
            this.pos = _pos;

            const tileMat: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Tile.material);
            tileMat.clrPrimary.setCSS("white");

            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(Tile.mesh));
            this.addComponent(tileMat);
            
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(this.size, this.size, 1));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.translate(this.pos);

            this.addComponent(tileMat);
        }
    }
}