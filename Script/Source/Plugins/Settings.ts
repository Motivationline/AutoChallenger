namespace Script {
    // import ƒ = FudgeCore;
    export type Setting = SettingCategory | SettingNumber | SettingString;

    interface SettingsBase {
        type: string;
        name: string;
    }

    export interface SettingCategory extends SettingsBase {
        type: "category";
        settings: Setting[];
    }

    export interface SettingString extends SettingsBase {
        type: "string";
        value: string;
    }
    export interface SettingNumber extends SettingsBase {
        type: "number";
        value: number;
        min: number;
        max: number;
        step: number;
        variant: "range" | "percent";
    }

    export class Settings {
        private static settings: Setting[] = [];

        static proxySetting<T extends Setting>(_setting: T, onValueChange: (_old: any, _new: any) => void): T {
            return new Proxy(_setting, {
                set(target, prop, newValue, receiver) {
                    if (prop === "value")
                        onValueChange((<any>target)[prop], newValue);
                    return Reflect.set(target, prop, newValue, receiver);
                },
            })
        }

        static addSettings(..._settings: Setting[]) {
            _settings.forEach(setting => this.settings.push(setting));
        }

        static generateHTML(_settings: Setting[] = this.settings): HTMLElement {
            const wrapper = createElementAdvanced("div", { classes: ["settings-wrapper"], innerHTML: "<h2 class='h'><span>Settings</span></h2>" });

            for (let setting of _settings) {
                wrapper.appendChild(this.generateSingleHTML(setting))
            }

            return wrapper;
        }

        private static generateSingleHTML(_setting: Setting): HTMLElement {
            let element: HTMLElement;
            switch (_setting.type) {
                case "string": {
                    element = this.generateStringInput(_setting);
                    break;
                }
                case "number": {
                    element = this.generateNumberInput(_setting)
                    break;
                }
                case "category": {
                    element = createElementAdvanced("div", { classes: ["settings-category"], innerHTML: `<span class="settings-category-name">${_setting.name}</span>` })
                    for (let setting of _setting.settings) {
                        element.appendChild(this.generateSingleHTML(setting));
                    }
                    break;
                }
                default: {
                    element = createElementAdvanced("div", { innerHTML: "Unknown Setting Type", classes: ["settings-unknown"] })
                }
            }

            return element;
        }

        private static generateStringInput(_setting: SettingString): HTMLElement {
            const id: string = randomString(10);
            const element = createElementAdvanced("label", { classes: ["settings-string-wrapper", "settings-label"], innerHTML: `<span class="settings-string-label settings-label-text">${_setting.name}</span>`, attributes: [["for", id]] });
            const input = createElementAdvanced("input", { classes: ["settings-string-input", "settings-input"], attributes: [["type", "string"], ["value", _setting.value], ["name", id]], id })

            element.appendChild(input);

            input.addEventListener("change", () => {
                _setting.value = input.value;
            });
            return element;
        }
        private static generateNumberInput(_setting: SettingNumber): HTMLElement {
            const id: string = randomString(10);
            const element = createElementAdvanced("label", { classes: ["settings-number-wrapper", "settings-label", _setting.name.toLowerCase()], innerHTML: `<span class="settings-number-label settings-label-text">${_setting.name}</span>`, attributes: [["for", id]] });
            switch (_setting.variant) {
                case "percent": {
                    const buttonMinus = createElementAdvanced("button", {
                        classes: ["settings-number-input-button","minus", "settings-input"],
                        innerHTML: "-"
                    })
                    const input = createElementAdvanced("input", {
                        classes: ["settings-number-input", "settings-input", "number-input"],
                        attributes: [["type", "number"], ["value", (_setting.value * 100).toString()], ["name", id], ["min", (_setting.min * 100).toString()], ["max", (_setting.max * 100).toString()], ["step", (_setting.step * 100).toString()]],
                        id
                    });
                    const buttonPlus = createElementAdvanced("button", {
                        classes: ["settings-number-input-button","plus", "settings-input"],
                        innerHTML: "+"
                    })
                    element.append(buttonMinus, input, buttonPlus);
                    input.addEventListener("change", () => {
                        let value = Math.min(_setting.max, Math.max(_setting.min, Number(input.value) / 100));
                        _setting.value = value;
                        input.value = Math.round(value * 100).toString();
                    });
                    buttonMinus.addEventListener("click", ()=>{input.stepDown(); input.dispatchEvent(new InputEvent("change"))});
                    buttonPlus.addEventListener("click", ()=>{input.stepUp(); input.dispatchEvent(new InputEvent("change"))});
                    break;
                }
                case "range": {
                    const input = createElementAdvanced("input", {
                        classes: ["settings-number-input", "settings-input", "slider"],
                        attributes: [["type", "range"], ["value", _setting.value.toString()], ["name", id], ["min", _setting.min.toString()], ["max", _setting.max.toString()], ["step", _setting.step.toString()]],
                        id
                    })
                    input.addEventListener("input", () => {
                        _setting.value = Number(input.value);
                        const percent = _setting.value / (_setting.max - _setting.min) * 100;
                        input.style.setProperty("--percent", `${percent}%`);
                    });
                    break;
                }
            }

            return element;
        }
    }
}