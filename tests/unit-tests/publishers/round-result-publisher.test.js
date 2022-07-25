import { RoundResultPublisher } from "../../../src/publishers/round-result-publisher";
import { Core } from "sc-game-base";
describe("round result publisher instance", () => {
    const gameData = new Core.GameData();
    const gameName = "keno power";

    const publisher = new RoundResultPublisher(gameName, gameData);

    beforeEach(() => {
        spyOn(publisher, "publishToAllUsers");
        spyOn(publisher, "publishToAllAdmins");
    });

    it("publishMD5_should call specific methods", () => {
        // act
        publisher.publishMD5("md5");

        // assert
        expect(publisher.publishToAllUsers).toHaveBeenCalled();
        expect(publisher.publishToAllAdmins).toHaveBeenCalled();
    });
});
