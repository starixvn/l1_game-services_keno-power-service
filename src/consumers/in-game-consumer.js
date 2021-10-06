import { Core } from "sc-game-base";

export class InGameConsumer extends Core.BaseEventConsumers.InGameConsumer {
    async buildPayload(realPlayer) {
        const basePayload = await super.buildPayload(realPlayer);
        const { currentMD5 } = this.gameData;

        return {
            ...basePayload,
            md5: currentMD5,
        };
    }
}
