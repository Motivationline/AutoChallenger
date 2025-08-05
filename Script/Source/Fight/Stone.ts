namespace Script {
    export interface StoneData {
        id: string;
        abilityLevels: AbilityData[];
        info?: string;
    }

    export class Stone {
        #level: number;
        #abilityLevels: AbilityData[];
        #id: string;
        #triggers: Set<EVENT> = new Set();
        #data: StoneData;

        constructor(_data: StoneData, _level: number = 0) {
            this.#data = _data;
            this.#abilityLevels = _data.abilityLevels;
            this.level = _level;
            this.#id = _data.id;

            for (let ability of this.#abilityLevels) {
                if (Array.isArray(ability.on)) {
                    for (let ev of ability.on) {
                        this.#triggers.add(ev);
                    }
                } else {
                    this.#triggers.add(ability.on);
                }
            }
        }

        set level(_lvl: number) {
            this.#level = Math.max(0, Math.min(this.#abilityLevels.length - 1, _lvl));
        }

        get level() {
            return this.#level;
        }

        get data() {
            return this.#data;
        }

        get id() {
            return this.#id;
        }

        addEventListeners() {
            for (let trigger of this.#triggers) {
                EventBus.addEventListener(trigger, this.abilityEventListener);
            }
            EventBus.addEventListener(EVENT.RUN_END, this.removeEventListeners);
        }
        
        removeEventListeners = () => {
            for (let trigger of this.#triggers) {
                EventBus.removeEventListener(trigger, this.abilityEventListener);
            }
            EventBus.removeEventListener(EVENT.RUN_END, this.removeEventListeners);
        }

        private abilityEventListener = async (_ev: FightEvent) => {
            await this.runAbility(_ev);
        }

        protected async runAbility(_ev: FightEvent) {
            let ability = this.#abilityLevels[this.#level];
            if (!ability) return;
            await executeAbility.call(this, ability, Fight.activeFight.arena, _ev);
        }
    }
}