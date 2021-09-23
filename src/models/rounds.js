import mongoose from "mongoose";

const settlementResultSchema = new mongoose.Schema(
    {
        blue: { type: Boolean, default: false },
        red: { type: Boolean, default: false },
        tie: { type: Boolean, default: false },
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },
        blueBig: { type: Boolean, default: false },
        blueSmall: { type: Boolean, default: false },
        redBig: { type: Boolean, default: false },
        redSmall: { type: Boolean, default: false },
    },
    { _id: false }
);

const resultSchema = new mongoose.Schema(
    {
        blue: { type: [Number], required: true },
        red: { type: [Number], required: true },
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
