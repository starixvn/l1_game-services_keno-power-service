import { GameDefinition } from "sc-multiple-games-base";
import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import MultipleGamesApp from "./multiple-games-app";

const run = async () => {
    const definitions = gameSettings.map((gameSetting) => new GameDefinition(gameSetting));
    const app = new MultipleGamesApp("Keno Power", appConfigs);
    await app.run();
    app.startGames(definitions);
};

run();
