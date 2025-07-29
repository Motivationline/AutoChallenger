namespace Script {
    export namespace DataContent {
        export const fights: FightData[] = [
            {
                rounds: 3,
                entities: [["pushover","pushover","pushover",],[,,,],[,,,]]
            },
            {
                // test eumlings
                rounds: 3, // ignore this
                // remember, opponents are usually to the left of this, so the eumling grid is mirrored internally.
                // But for your convenience right now during the test it's the way you'd see it ingame.
                entities: [
                    ["defaultEumling", , ,],
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
            },
            {
                //test entity visualizer with models
                rounds: 3,
                entities: [
                    ["kacki", "Björn", "kacki",],
                    ["kacki", "kacki", "kacki",],
                    ["kacki", "kacki", "kacki",]],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    ["boxingBush", , ,],
                    [, "boxingBush", ,],
                    [, , "boxingBush",]],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, , ,],
                    [, "flameFlinger", "punchingPalmtree",],
                    [, , ,]],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    ["flameFlinger", , ,],
                    [, "sandSitter", "boxingBush",],
                    ["flameFlinger", , ,]],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, "flameFlinger", ,],
                    ["flameFlinger", "punchingPalmtree", "flameFlinger",],
                    [, "flameFlinger", ,]],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, , "flameFlinger",],
                    [, "sandSitter", ,],
                    ["boxingBush", , "flameFlinger",]],
            },
            {
                difficulty: 0,
                rounds: 3,
                entities: [
                    [, "punchingPalmtree", ,],
                    ["boxingBush", , ,],
                    [, "punchingPalmtree", ,]],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    [, , "punchingPalmtree",],
                    ["worriedWall", "countdownCoconut", ,],
                    [, , ,]],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    ["worriedWall", , "cactusCrawler",],
                    [, "cactusCrawler", ,],
                    ["cactusCrawler", "worriedWall", ,]],
            },
            {
                difficulty: 1,
                rounds: 3,
                entities: [
                    ["cactusCrawler", , "sandSitter",],
                    [, , ,],
                    [, "cactusCrawler", "sandSitter",]],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["worriedWall", "boxingBush", "sandSitter",],
                    ["worriedWall", "cactusCrawler", "countdownCoconut",],
                    [, , ,]],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["boxingBush", , "flameFlinger",],
                    ["cactusCrawler", "sandSitter", ,],
                    ["flameFlinger", , "boxingBush",]],
            },
            {
                difficulty: 2,
                rounds: 3,
                entities: [
                    ["cactusCrawler", "countdownCoconut", "cactusCrawler",],
                    [, "cactusCrawler", ,],
                    ["cactusCrawler", , "countdownCoconut",]],
            },
        ]
    }
}