import { Core } from "sc-game-base";

import MultipleGamesApp from "../../src/multiple-games-app";

describe("Keno power app instance", () => {
    const app = new MultipleGamesApp("Keno Power", {});
    it("inherit Core.BaseGameApp", () => {
        expect(app instanceof Core.BaseGameApp).toBeTruthy();
    });
});
