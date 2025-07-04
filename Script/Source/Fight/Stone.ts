namespace Script {
    export interface StoneData {
        id: string;
        abilityLevels: AbilityData[];
    }

    export class Stone {
        #level: number;
        #abilityLevels: AbilityData[];
        #id: string;
        #triggers: Set<EVENT> = new Set();

        constructor(_data: StoneData, _level: number = 0) {
            this.level = _level;
            this.#abilityLevels = _data.abilityLevels;
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

        get id() {
            return this.#id;
        }

        registerEventListeners() {
            for (let trigger of this.#triggers) {
                EventBus.addEventListener(trigger, this.abilityEventListener);
            }
        }

        removeEventListeners() {
            for (let trigger of this.#triggers) {
                EventBus.removeEventListener(trigger, this.abilityEventListener);
            }
        }

        private abilityEventListener = async (_ev: FightEvent) => {
            await this.runAbility(_ev);
        }

        protected async runAbility(_ev: FightEvent) {
            let ability = this.#abilityLevels[this.#level];
            if (!ability) return;
            executeAbility.call(this, ability, Fight.activeFight.arena, _ev);
        }
    }
}