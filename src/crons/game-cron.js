import cron from "cron";
import mongoose from "mongoose";
import { Core } from "sc-game-base";
import { RoundResultConsumer } from "../consumers";

export class GameCron extends Core.Crons.BaseGameCron {
    /**
     * @param {Object} dependencies
     * @param {mongoose.Model} dependencies.globalConfigsRepository
     * @param {RoundResultConsumer} dependencies.roundResultConsumer
     */
    constructor({
        definition,
        gameData,
        bot,
        settleGameRoundConsumer,
        gameStatusPublisher,
        runningRoundInfoPublisher,
        logService,
        gameConfigsRepository,
        roundsRepository,
        archiveStatusesRepository,
        notificationRepository,
        roundResultConsumer,
    }) {
        super({
            definition,
            gameData,
            bot,
            settleGameRoundConsumer,
            gameStatusPublisher,
            runningRoundInfoPublisher,
            logService,
            gameConfigsRepository,
            roundsRepository,
            archiveStatusesRepository,
            notificationRepository,
        });

        this.roundResultConsumer = roundResultConsumer;
    }

    async proceed() {
        const { durations } = this.definition;

        if (this.gameData.remainingTime === durations.wholeRound) {
            await this.checkGameStatus();
        }

        if (!this.gameData.disabled) {
            this.gameData.remainingTime--;
        }

        if (this.isStartingTime(this.gameData.remainingTime, durations)) {
            this.resetForNewRound();
            await this.roundResultConsumer.generateResult();
        }

        if (this.gameData.remainingTime < 0) {
            this.gameData.remainingTime = durations.wholeRound;
            await this.settleGameRoundConsumer.settleRound(this.gameData);
        } else if (this.gameData.remainingTime < durations.placingBets) {
            this.bot && (await this.bot.run());
            this.runningRoundInfoPublisher.publish();
        }
    }

    async start() {
        const lastRound = await this.roundsRepository
            .findOne({}, "id", { sort: { id: -1 } })
            .lean()
            .exec();
        const job = new cron.CronJob(
            "* * * * * *",
            () => this.proceed().catch(this.logService.logError),
            () => {
                this.logService.logError(
                    `${this.definition.name} unexpectedly stopped at round #${this.gameData.roundId} because some other tasks halt it.`
                );
                job.start();
            }
        );

        if (lastRound) {
            if (lastRound.settled) {
                this.gameData.roundId = lastRound.id + 1;
            } else {
                this.gameData.roundId = lastRound.id;
                this.gameData.remainingTime = 0;

                await this.checkGameStatus();
            }
        } else {
            this.gameData.roundId = await this.getLastArchiveRound();
        }

        job.start();
    }

    isStartingTime(remainingTime, durations) {
        return remainingTime === durations.placingBets;
    }
}
