namespace Script {
    export class Eumling extends Entity {
        static xpRequirements: number[] = [3, 6];
        #types: string[] = [];
        #xp: number = 0;
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

            this.#types.push(_type);
        }

        get type() {
            return this.#types.join("") + "-Eumling";
        }

        get xp() {
            return this.#xp;
        }

        get requiredXPForLevelup() {
            return Eumling.xpRequirements[this.#types.length - 1];
        }

        async addXP(_amount: number) {

            while (this.#types.length < 3 && _amount > 0) { // can only upgrade until lvl 3
                let requiredUntilLevelup = this.requiredXPForLevelup;
                if (requiredUntilLevelup === undefined) return;

                if (_amount > 0) {
                    this.#xp += 1;
                    _amount--;
                    EventBus.dispatchEvent({ type: EVENT.EUMLING_XP_GAIN, target: this });
                    if (requiredUntilLevelup <= this.#xp) {
                        await this.levelup();
                    }
                }
            }
        }

        async levelup() {
            EventBus.dispatchEvent({ type: EVENT.EUMLING_LEVELUP_CHOOSE, target: this });
            let event = await EventBus.awaitSpecificEvent(EVENT.EUMLING_LEVELUP_CHOSEN);
            const chosenSpecial = event.detail.type;
            this.addType(chosenSpecial);
            this.#xp = 0;
            EventBus.dispatchEvent({ type: EVENT.EUMLING_LEVELUP, target: this });
        }
    }
}