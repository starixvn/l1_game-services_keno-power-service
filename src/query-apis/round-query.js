import { Core } from "sc-game-base";

export class RoundQuery extends Core.QueryApis.RoundQuery {
    async getList(limit, projections) {
        const rounds = await this.roundsRepository
            .find({ settled: true }, projections, { sort: { _id: -1 }, limit: limit })
            .lean()
            .exec();

        return rounds.map((round) => {
            const result = round.result ?? this.convertResult(round);
            const settlementResult = round.settlementResult ?? this.convertSettlementResult(result);

            return {
                roundId: round.id,
                result,
                settlementResult,
            };
        });
    }
}
