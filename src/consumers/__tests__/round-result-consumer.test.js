import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core } from "sc-game-base";
import { choices, choicesMapper } from "../../constants";
import { RoundResultConsumer, RoundResultPublisher } from "../";

describe("Round result consumer instance", () => {
    // arrange
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
    const gameData = new Core.GameData(0);

    /** @type {mongoose.Model}*/
    const roundsRepository = stubMongooseModelStupidly(mongoose.Model);

    /** @type {RoundResultPublisher}*/
    const roundResultPublisher = stub(RoundResultPublisher);

    const roundResultConsumer = new RoundResultConsumer(gameData, definition, roundsRepository, roundResultPublisher);

    beforeEach(() => {
        gameData.roundId = 1;
        gameData.gameConfigs = { enabled: true };
        gameData.settlementResultFromAdmin = {};
        definition.generateResult = jest.fn(() => ({
            blue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            red: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        }));
        definition.settle = jest.fn();
    });

    describe("generateResult tests", () => {
        it("should not call generateResult when set result from admin", async () => {
            // arrange
            gameData.roundId = 2;
            gameData.settlementResultFromAdmin = {
                roundId: 2,
                result: {
                    blue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                    red: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                },
            };

            // act
            await roundResultConsumer.generateResult();

            // assert
            expect(definition.generateResult).not.toHaveBeenCalled();
        });

        it("should call generateResult when not set result from admin", async () => {
            // arrange
            gameData.roundId = 2;

            // act
            await roundResultConsumer.generateResult();

            // assert
            expect(definition.generateResult).toHaveBeenCalled();
            expect(definition.settle).toHaveBeenCalled();
            expect(roundResultPublisher.publishMD5).toHaveBeenCalled();
        });
    });
});
