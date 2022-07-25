import { Core } from "sc-game-base";

import { KenoPowerApp } from "../../src/app";

describe("Keno power app instance", () => {
    const app = new KenoPowerApp("Keno Power", {});
    it("inherit Core.BaseGameApp", () => {
        expect(app instanceof Core.BaseGameApp).toBeTruthy();
    });
});
