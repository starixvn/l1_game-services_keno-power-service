import { asClass, asValue } from "awilix";
import { GameDefinition, MultipleGamesContainerRegistry } from "sc-multiple-games-base";
import { GameCron } from "./crons/game-cron";
import { SettleGameRoundConsumer, RoundResultConsumer, InGameConsumer } from "./consumers";
import { RoundResultPublisher } from "./publishers";
import { RoundQuery } from "./query-apis/round-query";

export default class KenoPowerContainerRegistry extends MultipleGamesContainerRegistry {
    /**
     * @param {object} appConfigs
     * @param {GameDefinition} definition
     */
    register(appConfigs, definition, gameData) {
        super.register(appConfigs, definition, gameData);

        this.registerRepositories(definition.repositories);

        return this.container;
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            gameCron: asClass(GameCron).singleton().proxy(),
        });
    }

    registerRepositories(repositories) {
        this.container.register({
            roundsRepository: asValue(repositories.roundsRepository),
            betsRepository: asValue(repositories.betsRepository),
            betLogsRepository: asValue(repositories.betLogsRepository),
            tempBetsRepository: asValue(repositories.tempBetsRepository),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
            roundResultConsumer: asClass(RoundResultConsumer).singleton(),
            inGameConsumer: asClass(InGameConsumer).singleton(),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            roundResultPublisher: asClass(RoundResultPublisher).singleton(),
        });
    }

    registerApis() {
        super.registerApis();
        this.container.register({
            roundQuery: asClass(RoundQuery).singleton(),
        });
    }
}
