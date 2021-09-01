import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },
    time: { type: Date },
    odds: { type: Object },

    player: { type: Number, default: 0 },
    banker: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    odd: { type: Number, default: 0 },
    even: { type: Number, default: 0 },
    red: { type: Number, default: 0 },
    orange: { type: Number, default: 0 },
    yellow: { type: Number, default: 0 },
    green: { type: Number, default: 0 },
    blue: { type: Number, default: 0 },
    indigo: { type: Number, default: 0 },
    violet: { type: Number, default: 0 },
    playerBig: { type: Number, default: 0 },
    playerSmall: { type: Number, default: 0 },
    bankerBig: { type: Number, default: 0 },
    bankerSmall: { type: Number, default: 0 },

    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    refund: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

export default (modelName) => {
    return mongoose.model(modelName, schema);
};
