import Chance from "chance";
import { Random, MersenneTwister19937 } from "random-js";

const chance = new Chance();
const random = new Random(MersenneTwister19937.autoSeed());
const seeds = [...Array(81).keys()].slice(1);

const shuffleThenPickOut20ByChance = () => chance.pickset(seeds, 20);

const random20UniqueNumbersByChance = () => chance.unique(chance.natural, 20, { min: 1, max: 80 });

const shuffleThenPickOut20ByRandomJs = () => random.shuffle([...seeds]).slice(0, 20);

const randomlyPick20NumbersByRandomJs = () => random.sample(seeds, 20);

const algorithms = [
    shuffleThenPickOut20ByChance,
    random20UniqueNumbersByChance,
    shuffleThenPickOut20ByRandomJs,
    randomlyPick20NumbersByRandomJs,
];

const getRandom20Numbers = () => {
    const randomSelection = chance.natural({
        min: 0,
        max: algorithms.length - 1,
    });
    const result = algorithms[randomSelection]();

    return result.sort((pre, next) => pre - next);
};

const settlementResultRuleEntries = Object.entries({
    blue: ({ totalBlue, totalRed }) => totalBlue > totalRed,
    red: ({ totalBlue, totalRed }) => totalRed > totalBlue,
    tie: ({ totalBlue, totalRed }) => totalBlue === totalRed,
    big: ({ totalBlue, totalRed }) => totalBlue + totalRed >= 1621,
    small: ({ totalBlue, totalRed }) => totalBlue + totalRed < 1621,
    odd: ({ totalBlue, totalRed }) => (totalBlue + totalRed) % 2 === 1,
    even: ({ totalBlue, totalRed }) => (totalBlue + totalRed) % 2 === 0,
    blueBig: ({ totalBlue }) => totalBlue >= 811,
    blueSmall: ({ totalBlue }) => totalBlue < 811,
    redBig: ({ totalRed }) => totalRed >= 811,
    redSmall: ({ totalRed }) => totalRed < 811,
});

export const generateResult = () => {
    return {
        blue: getRandom20Numbers(),
        red: getRandom20Numbers(),
    };
};

export const getSettlementResult = (totalPoints) => {
    return settlementResultRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(totalPoints);

        return result;
    }, {});
};
