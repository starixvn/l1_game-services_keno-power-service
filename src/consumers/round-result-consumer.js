import mongoose from "mongoose";
import { GameDefinition } from "sc-multiple-games-base";

import { sumArrayNumber } from "../helpers/array-helper";
import { createHashMD5, randomString } from "../helpers/crypto-helper";
import { RoundResultPublisher } from "../publishers/round-result-publisher";

export class RoundResultConsumer {
    /**
     * @param {GameData} gameData
     * @param {GameDefinition} definition
     * @param {mongoose.Model} roundsRepository
     * @param {RoundResultPublisher} roundResultPublisher
     */
    constructor(gameData, definition, roundsRepository, roundResultPublisher) {
        this.gameData = gameData;
        this.definition = definition;
        this.roundsRepository = roundsRepository;
        this.roundResultPublisher = roundResultPublisher;
    }

    async generateResult() {
        const resultFromAdmin = this.gameData.settlementResultFromAdmin;

        const result = this.gameData.roundId === resultFromAdmin.roundId ? resultFromAdmin.result : this.definition.generateResult();

        const totalPlayer = sumArrayNumber(result.player);
        const totalBanker = sumArrayNumber(result.banker);
        const settlementResult = this.definition.settle({ totalPlayer, totalBanker }, true);

        const resultKey = `[${totalPlayer};${totalBanker}]${randomString()}`;
        const md5 = createHashMD5(resultKey);

        await this.roundsRepository.create({
            id: this.gameData.roundId,
            result,
            settlementResult,
            resultKey,
            md5,
            time: new Date(),
        });

        Object.assign(this.gameData, { result, settlementResult, totalPlayer, totalBanker, resultKey });
        this.roundResultPublisher.publishMD5(md5);
    }
}
