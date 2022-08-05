import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
import { choices, choicesMapper } from "../../../src/constants";
import { hedgeBetGroups } from "../../../src/game-settings";
import getRoundRepository from "../../../src/models/rounds";
import getBetRepository from "../../../src/models/bets";
import getBetLogsRepository from "../../../src/models/bet-logs";

export default [
    {
        id: 40,
        name: "KenoPower1",
        durations: {
            wholeRound: 50,
            placingBets: 42,
            lockingBet: 5,
        },
        choices,
        choicesMapper,
        defaultBetTracks: {},
        hedgeBetGroups,
        repositories: {
            roundsRepository: getRoundRepository("kenopower1_phien"),
            betsRepository: getBetRepository("kenopower1_one"),
            betLogsRepository: getBetLogsRepository("kenopower1_cuoc"),
        },
        generateResult,
        settle: getSettlementResult,
    },
];
