import { Core } from "sc-game-base";

export class SettleGameRoundConsumer extends Core.BaseEventConsumers.SettleGameRoundConsumer {
    calculateBetResult(settlementResult, bet, odds) {
        const betResult = Object.entries(settlementResult).reduce(
            (result, [choice, win]) => {
                const betAmount = bet[choice] ?? 0;
                const originalOdds = odds[choice] || 1;
                const effectiveOdds = bet.freeBet ? originalOdds - 1 : originalOdds;
                const refund = ["blue", "red"].includes(choice) && settlementResult.tie ? betAmount : 0;
                const winAmount = win ? betAmount * effectiveOdds : refund;

                result.refund += refund;
                result.totalBetAmount += betAmount;
                result.totalWin += winAmount;

                if (winAmount > 0) {
                    result.winningByChoices[choice] = winAmount;
                    result.netWin += winAmount - betAmount;
                } else {
                    result.totalLost += betAmount - refund;
                }

                return result;
            },
            {
                totalBetAmount: 0,
                totalWin: 0,
                netWin: 0,
                totalLost: 0,
                refund: 0,
                winningByChoices: {},
            }
        );

        betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
        betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

        return betResult;
    }

    async settleRound() {
        const round = await this.roundsRepository.findOne({ id: this.gameData.roundId }).lean().exec();

        if (round) {
            this.gameData.roundId = round.id + 1;

            await this.settleBets(round);
            await this.roundsRepository.updateOne({ id: round.id }, { settled: true });
        }
    }

    async settleBets({ result, settlementResult, id: roundId, time, resultKey }) {
        const bets = await this.queryBets(roundId);

        if (bets && bets.length) {
            const { odds } = this.gameData.gameConfigs;

            await Promise.all(
                bets.map(async (bet) => {
                    const betResult = this.calculateBetResult(settlementResult, bet, odds);

                    bet.betwin = betResult.totalWin - betResult.refund;
                    bet.refund = betResult.refund;
                    bet.thanhtoan = true;

                    await bet.save();

                    await this.callEndGame(bet, roundId, time, betResult);

                    this.captureBetResult(bet.uid, betResult);
                    await this.userBetResultPublisher.publish(bet.uid, betResult);
                })
            );
        }

        this.roundResultPublisher.publishRoundResult({
            result,
            settlementResult,
            resultKey,
            roundId,
        });
    }
}
