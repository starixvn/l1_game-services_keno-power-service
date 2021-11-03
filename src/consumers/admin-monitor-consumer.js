import { Core } from "sc-game-base";

export default class AdminMonitorConsumer extends Core.BaseEventConsumers.AdminMonitorConsumer {
    /**
     * @param {Socket} socketClient
     */
    async consume(socketClient) {
        const lastRound = await this.roundsRepository
            .findOne({ settled: true }, { id: true, result: true, settlementResult: true }, { sort: { id: -1 } })
            .lean()
            .exec();

        if (lastRound) {
            const payload = {
                roundId: lastRound.id + 1,
                result: lastRound.result,
                settlementResult: lastRound.settlementResult,
                remainingTime: this.gameData.remainingTime,
            };

            this.adminPublisher.publishToAdmin(socketClient, payload);
        }
    }
}
