import { choices, choicesMapper } from "./constants";
import { getSettlementResult, generateResult } from "./helpers/result-helper";
import getBetLogsRepository from "./models/bet-logs";
import getBetRepository from "./models/bets";
import getRoundRepository from "./models/rounds";

export default [
    {
        id: 40,
        name: "KenoPower1",
        durations: {
            wholeRound: 51,
            placingBets: 42,
            lockingBet: 5,
        },
        choices,
        choicesMapper,
        defaultBetTracks: {},
        repositories: {
            roundsRepository: getRoundRepository("kenopower1_phien"),
            betsRepository: getBetRepository("kenopower1_one"),
            betLogsRepository: getBetLogsRepository("kenopower1_cuoc"),
        },
        generateResult: generateResult,
        settle: getSettlementResult,
    },
    {
        id: 41,
        name: "KenoPower2",
        durations: {
            wholeRound: 55,
            placingBets: 42,
            lockingBet: 5,
        },
        choices,
        choicesMapper,
        defaultBetTracks: {},
        repositories: {
            roundsRepository: getRoundRepository("kenopower2_phien"),
            betsRepository: getBetRepository("kenopower2_one"),
            betLogsRepository: getBetLogsRepository("kenopower2_cuoc"),
        },
        generateResult: generateResult,
        settle: getSettlementResult,
    },
];
