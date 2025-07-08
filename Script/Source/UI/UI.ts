
namespace Script {
    import ƒ = FudgeCore;

    export interface ToggleableInteraction {
        enable: () => void;
        disable: () => void;
    }

    let uis: Map<string, ToggleableInteraction>;
    let activeUI: ToggleableInteraction;
    export function setupUI() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

        uis = new Map<string, ToggleableInteraction>([
        ])
        // activeUI = uis.get("close");
        // activeUI?.enable();

        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                enableUI((<HTMLElement>btn).dataset.target);
            });
        });

    }

    export function enableUI(_type: string) {
        let nextUI = uis.get(_type);
        if (!nextUI) return;
        if (activeUI) activeUI.disable();
        nextUI.enable();
        activeUI = nextUI;
    }
}

