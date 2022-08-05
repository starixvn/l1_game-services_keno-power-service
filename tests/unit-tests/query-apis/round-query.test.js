import { stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";

import { RoundQuery } from "../../../src/query-apis/round-query";

describe("round query test", () => {
    /** @type {mongoose.Model}*/
    const roundsRepository = stubMongooseModelStupidly(mongoose.Model);

    const roundQuery = new RoundQuery(roundsRepository);

    describe("getList_", () => {
        it("always_calls roundsRepository", async () => {
            // arrange
            const rounds = [{ id: 1 }];
            roundsRepository.find().lean().exec.mockReturnValueOnce(rounds);

            // act
            await roundQuery.getList(10, {});

            // assert
            expect(roundsRepository.find().lean().exec).toHaveBeenCalled();
        });
    });
});
