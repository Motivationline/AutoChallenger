namespace Script {
    export class Eumling extends Entity {
        #types: string[] = [];
        constructor(_startType: string) {
            _startType = _startType.trim().toUpperCase();
            const data = Provider.data.getEntity(_startType + "-Eumling");
            if (!data) throw new Error("Tried to create an unknown Eumling type: " + _startType);
            super(data);
            this.#types = _startType.split("");
        }

        get types(): Readonly<string[]> {
            return this.#types;
        }

        addType(_type: string) {
            if (this.#types.length === 3) throw new Error("Eumling already has 3 types, can't add more.");
            if (_type.length !== 1) throw new Error("Only one type can be added at a time.");
            _type = _type.toUpperCase();
            let newType = this.#types.join("") + _type + "-Eumling";
            let newData = Provider.data.getEntity(newType);
            if (!newData) throw new Error("Tried to create an invalid eumling: " + newType);

            this.updateEntityData(newData);

            this.removeEventListeners();
            this.registerEventListeners();

        }
    }
}