import mongoose from "mongoose";

const settlementResultSchema = new mongoose.Schema(
    {
        player: { type: Boolean, default: false },
        banker: { type: Boolean, default: false },
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },
        red: { type: Boolean, default: false },
        orange: { type: Boolean, default: false },
        yellow: { type: Boolean, default: false },
        green: { type: Boolean, default: false },
        blue: { type: Boolean, default: false },
        indigo: { type: Boolean, default: false },
        violet: { type: Boolean, default: false },
        playerBig: { type: Boolean, default: false },
        playerSmall: { type: Boolean, default: false },
        bankerBig: { type: Boolean, default: false },
        bankerSmall: { type: Boolean, default: false },
    },
    { _id: false }
);

const resultSchema = new mongoose.Schema(
    {
        player: { type: [Number], required: true },
        banker: { type: [Number], required: true },
    },
    { _id: false }
);

const schema = new mongoose.Schema({
    id: { type: Number, require: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    resultKey: { type: String },
    md5: { type: String },
    settled: { type: Boolean, default: false },
    time: { type: Date, default: new Date() },
});

export default (modelName) => {
    return mongoose.model(modelName, schema);
};
