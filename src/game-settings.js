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
            wholeRound: 50,
            placingBets: 37,
            lockingBet: 5,
        },
        choices,
        choicesMapper,
        defaultBetTracks: {},
        repositories: {
            roundsRepository: getRoundRepository("kenopower1_phien"),
            betsRepository: getBetRepository("kenopower1_cuoc"),
            betLogsRepository: getBetLogsRepository("kenopower1_log"),
        },
        generateResult: generateResult,
        settle: getSettlementResult,
    },
    {
        id: 41,
        name: "KenoPower2",
        durations: {
            wholeRound: 54,
            placingBets: 37,
            lockingBet: 5,
        },
        choices,
        choicesMapper,
        defaultBetTracks: {},
        repositories: {
            roundsRepository: getRoundRepository("kenopower2_phien"),
            betsRepository: getBetRepository("kenopower2_cuoc"),
            betLogsRepository: getBetLogsRepository("kenopower2_log"),
        },
        generateResult: generateResult,
        settle: getSettlementResult,
    },
];
