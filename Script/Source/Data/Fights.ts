namespace Script {
    export namespace DataContent {
        export const fights: FightData[] = [
            {
                // test eumlings
                rounds: 3, // ignore this
                // remember, opponents are usually to the left of this, so the eumling grid is mirrored internally.
                // But for your convenience right now during the test it's the way you'd see it ingame.
                entities: [
                    ["attackTests", , ,],
                    [, , ,],
                    [, , ,]],
            },
            {
                // test opponent
                rounds: 3,
                entities: [
                    ["e1", "e2", "e3",],
                    ["e4", "e5", "e6",],
                    ["e7", "e8", "e9",]],
            },
            {
                rounds: 3,
                entities: [
                    [, , ,],
                    [, "attackRandomEnemy", ,],
                    [, , ,]],
            }
        ]
    }
}