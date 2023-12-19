import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    time: { type: Date },
    odds: { type: Object },

    blue: { type: Number, default: 0 },
    red: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    odd: { type: Number, default: 0 },
    even: { type: Number, default: 0 },
    blueBig: { type: Number, default: 0 },
    blueSmall: { type: Number, default: 0 },
    redBig: { type: Number, default: 0 },
    redSmall: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    refund: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
    currency: { type: String, require: true },
    rate: { type: Number, require: true },

    playerId: { type: String },
    operatorId: { type: String, require: true },
    roundId: { type: Number, required: true },
    paid: { type: Boolean, default: false },
});

export default (modelName) => {
    return mongoose.model(modelName, schema);
};
