import { Core } from "sc-game-base";
import { GameDefinition } from "sc-multiple-games-base";
import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import KenoPowerContainerRegistry from "./keno-power-container-registry";
import { GameData } from "./game-data";

export class KenoPowerApp extends Core.BaseGameApp {
    /**
     * @param {GameDefinition[]} definitions
     */
    startGames(definitions) {
        definitions.forEach(async (definition) => {
            const container = new KenoPowerContainerRegistry().register(
                this.appConfigs,
                definition,
                new GameData(definition.durations.wholeRound)
            );
            await this.startGame(container);
        });
    }
}

const run = async () => {
    const definitions = gameSettings.map((gameSetting) => new GameDefinition(gameSetting));
    const app = new KenoPowerApp("Keno Power", appConfigs);
    await app.run();
    app.startGames(definitions);
};

run();
