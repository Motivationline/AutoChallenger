namespace Script {
    import ƒ = FudgeCore;
    /** Handles an entire run */
    export class Run {
        eumlings: Eumling[] = [];
        progress: number = 0;

        async start() {
            // TODO: Select Start-Eumling Properly
            let eumling: string;
            while (eumling !== "R" && eumling !== "S") {
                eumling = prompt("Which eumling you want to start with? (R or S)", "R").trim().toUpperCase();
            }
            this.eumlings.push(new Eumling(eumling));

            await EventBus.dispatchEvent({ type: EVENT.RUN_START });
        }

        async chooseNext() {
            // 
        }
    }
}