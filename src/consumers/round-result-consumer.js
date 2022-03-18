import mongoose from "mongoose";
import { GameDefinition } from "sc-multiple-games-base";

import { sumArrayNumber } from "../helpers/array-helper";
import { createHashMD5, randomString, encrypt } from "../helpers/crypto-helper";
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
        const { roundId, exchangeRates } = this.gameData;
        const resultFromAdmin = this.gameData.settlementResultFromAdmin;

        const result = roundId === resultFromAdmin.roundId ? resultFromAdmin.result : this.definition.generateResult();

        const totalBlue = sumArrayNumber(result.blue);
        const totalRed = sumArrayNumber(result.red);

        const resultKey = `{${totalBlue};${totalRed}}_{#${roundId}${randomString()}}`;
        const md5 = createHashMD5(resultKey);

        this.gameData.currentMD5 = md5;
        await this.roundsRepository.create({
            id: roundId,
            md5,
            resultKey: encrypt(resultKey),
            encryptedResult: encrypt(JSON.stringify(result)),
            time: new Date(),
            exchangeRateId: exchangeRates.exId,
        });

        this.roundResultPublisher.publishMD5(md5);
    }
}
