import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core } from "sc-game-base";
import { choices, choicesMapper } from "../../constants";
import { RoundResultPublisher } from "../../publishers/round-result-publisher";
import { SettleGameRoundConsumer } from "../settle-game-round-consumer";

const gameData = new Core.GameData(30);

gameData.gameConfigs = {
    enabled: true,
    minbet: 1,
    maxbet: 1000,
    choices_maxbet: {
        blue: 1000,
        red: 1000,
    },
    odds: {
        blue: 1.96,
        red: 1.96,
        big: 1.96,
        small: 1.96,
        odd: 1.96,
        even: 1.96,
        blueBig: 1.96,
        blueSmall: 1.96,
        redBig: 1.96,
        redSmall: 1.96,
    },
    enableFreeBet: false,
};
const definition = {
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
};

const endGame = jest.fn();

/** @type {mongoose.Model}*/
const roundsRepository = { findOne: () => {}, updateOne: jest.fn() };

/** @type {RoundResultPublisher}*/
const roundResultPublisher = stub(RoundResultPublisher);

/** @type {Core.BaseEventPublishers.UserBetResultPublisher}*/
const userBetResultPublisher = stub(Core.BaseEventPublishers.UserBetResultPublisher);

/** @type {mongoose.Model}*/
const betsRepository = stubMongooseModelStupidly(mongoose.Model);

const consumer = new SettleGameRoundConsumer({
    definition: definition,
    gameData: gameData,
    roundResultPublisher: roundResultPublisher,
    userBetResultPublisher: userBetResultPublisher,
    endGame: endGame,
    roundsRepository: roundsRepository,
    betsRepository: betsRepository,
});

describe("settle game round consumer instance", () => {
    it("should instance of Core.BaseEventConsumers.SettleGameRoundConsumer", () => {
        expect(consumer instanceof Core.BaseEventConsumers.SettleGameRoundConsumer).toBeTruthy();
    });

    describe("calculateBetResult tests", () => {
        const testCases = [
            {
                settlementResult: {
                    blue: true,
                    red: false,
                    tie: false,
                    big: false,
                    small: true,
                    odd: true,
                    even: false,
                    blueBig: false,
                    blueSmall: true,
                    redBig: false,
                    redSmall: true,
                },
                bet: { blue: 100 },
                expectResult: {
                    totalBetAmount: 100,
                    totalWin: 196,
                    netWin: 96,
                    totalLost: 0,
                    refund: 0,
                    winningByChoices: {
                        blue: 196,
                    },
                },
            },
            {
                settlementResult: {
                    blue: false,
                    red: false,
                    tie: true,
                    big: false,
                    small: true,
                    odd: true,
                    even: false,
                    blueBig: false,
                    blueSmall: true,
                    redBig: false,
                    redSmall: true,
                },
                bet: { blue: 100 },
                expectResult: {
                    totalBetAmount: 100,
                    totalWin: 0,
                    netWin: 0,
                    totalLost: 0,
                    refund: 100,
                    winningByChoices: {},
                },
            },
        ];

        it.each(testCases)("should return correct result", ({ settlementResult, bet, expectResult }) => {
            const actualResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds);

            expect(actualResult).toEqual(expectResult);
        });
    });

    describe("settleRound tests", () => {
        it("should not call settleBets when current round not found", async () => {
            // arrange
            spyOn(roundsRepository, "findOne").and.callFake(() => {
                return {
                    lean: () => {
                        return {
                            exec: () => {
                                return null;
                            },
                        };
                    },
                };
            });
            spyOn(consumer, "settleBets");

            // act
            await consumer.settleRound();

            // assert
            expect(consumer.settleBets).not.toHaveBeenCalled();
        });

        it("should call settleBets and settle round when current round exist", async () => {
            // arrange
            const round = { id: 1, save: jest.fn(), settled: false };
            spyOn(roundsRepository, "findOne").and.callFake(() => {
                return {
                    lean: () => {
                        return {
                            exec: () => {
                                return round;
                            },
                        };
                    },
                };
            });
            spyOn(consumer, "settleBets");

            // act
            await consumer.settleRound();

            // assert
            expect(consumer.settleBets).toHaveBeenCalled();
            expect(roundsRepository.updateOne).toHaveBeenCalled();
        });
    });

    describe("settleBets tests", () => {
        it("always calls queryBets and publishRoundResult", async () => {
            // arrange
            const round = { id: 1, fullTime: {}, firstHalf: {}, odds: {} };
            spyOn(consumer, "queryBets");

            // act
            await consumer.settleBets(round);

            // assert
            expect(consumer.queryBets).toHaveBeenCalled();
            expect(roundResultPublisher.publishRoundResult).toHaveBeenCalled();
        });

        it("existing bets should settle bet and call end game", async () => {
            const round = {
                id: 1,
                result: {
                    blue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                    red: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                },
                settlementResult: {
                    blue: false,
                    red: false,
                    tie: true,
                    big: false,
                    small: false,
                    odd: false,
                    even: false,
                    blueBig: false,
                    blueSmall: false,
                    redBig: false,
                    redSmall: false,
                },
            };
            spyOn(consumer, "queryBets").and.callFake(() => [{ uid: 1, name: "aaaa", phien: 1, blue: 100, save: jest.fn() }]);
            spyOn(consumer, "callEndGame");
            spyOn(consumer, "calculateBetResult").and.callFake(() => ({}));

            // act
            await consumer.settleBets(round);

            // assert
            expect(consumer.calculateBetResult).toHaveBeenCalled();
            expect(consumer.queryBets).toHaveBeenCalled();
            expect(roundResultPublisher.publishRoundResult).toHaveBeenCalled();
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
