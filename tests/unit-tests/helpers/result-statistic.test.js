import { generateResult, getSettlementResult, randomModes } from "../../../src/helpers/result-helper";
import { hedgeBetGroups } from "../../../src/game-settings";
import { sumArrayNumber } from "../../../src/helpers/array-helper";

describe("Result statistic: 10000 times", () => {
    it.each(Object.keys(randomModes))("statistic should have expected result with mode %d", (mode) => {
        // Arrange
        const totalRounds = 10000;
        const streaks = {
            big: {},
            small: {},
            odd: {},
            even: {},
            blue: {},
            red: {},
            blueBig: {},
            blueSmall: {},
            redBig: {},
            redSmall: {},
        };
    
        const streakNumber = 4;
        const longestStreak = 4;
        let occurrences = {};
        let prevResult = {};
    
        const stats = {
            streaks: { total: 0, big: 0, small: 0, odd: 0, even: 0, blue: 0, red: 0, blueBig: 0, blueSmall: 0, redBig: 0, redSmall: 0 },
        };
    
        for (let index = 0; index < totalRounds; index++) {
            const result = generateResult(mode);
            const totalBlue = sumArrayNumber(result.blue);
            const totalRed = sumArrayNumber(result.red);
    
            const settlement = getSettlementResult({ totalBlue, totalRed });
    
            hedgeBetGroups.forEach((group) => {
                const currentWinningOption = group.find((choice) => settlement[choice]);
    
                if (prevResult[currentWinningOption]) {
                    occurrences[currentWinningOption]++;
                } else {
                    if (occurrences[currentWinningOption] >= streakNumber) {
                        stats.streaks.total++;
                        stats.streaks[currentWinningOption]++;
    
                        if (occurrences[currentWinningOption] >= longestStreak) {
                            streaks[currentWinningOption][occurrences[currentWinningOption]] =
                                streaks[currentWinningOption][occurrences[currentWinningOption]] ?? 0;
                            streaks[currentWinningOption][occurrences[currentWinningOption]]++;
                        }
                    }
    
                    occurrences[currentWinningOption] = 1;
                }
            });
    
            prevResult = settlement;
    
            Object.keys(settlement).reduce((choiceResults, choice) => {
                stats[choice] = stats[choice] ?? { count: 0, ratio: 0 };
                stats[choice].count += settlement[choice] ? 1 : 0;
                stats[choice].ratio = stats[choice].count / totalRounds;
            }, {});
        }

        //Assert

        console.log(`======== Run ${totalRounds} rounds for mode ${mode} ========`);
        console.log(stats);
        expect(stats["blue"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["red"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["tie"].ratio).toBeGreaterThanOrEqual(0.002);
        expect(stats["big"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["small"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["odd"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["even"].ratio).toBeGreaterThanOrEqual(0.48);       
        expect(stats["blueBig"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["blueSmall"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["redBig"].ratio).toBeGreaterThanOrEqual(0.48);
        expect(stats["redSmall"].ratio).toBeGreaterThanOrEqual(0.48);     
    });
});
