import { generateResult, getSettlementResult } from "../src/helpers/result-helper";
import { hedgeBetGroups } from "../src/game-settings";
import { sumArrayNumber } from "../src/helpers/array-helper";

function run() {
    const totalRounds = 100_000;
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

    const randomMode = 3;

    for (let index = 0; index < totalRounds; index++) {
        const result = generateResult(randomMode);
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
    console.log(`======== Run ${totalRounds} rounds ========`);

    console.log(stats);
    console.log(`Longest streaks (>=${longestStreak}): `);
    console.log(JSON.stringify(streaks));
}

run();
