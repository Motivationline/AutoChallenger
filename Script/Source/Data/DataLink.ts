namespace Script {
    import ƒ = FudgeCore;

    @ƒ.serialize
    export class DataLink extends ƒ.ComponentScript {
        static linkedNodes: Map<string, ƒ.Node> = new Map();

        @ƒ.serialize(String)
        public id: string;

        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, () => {
                if (this.node instanceof ƒ.Graph)
                    DataLink.linkedNodes.set(this.id, this.node);
            });
        }
    }
}