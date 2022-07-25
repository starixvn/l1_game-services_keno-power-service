import Chance from "chance";
import { Random, MersenneTwister19937 } from "random-js";
import { shuffle as d3Shuffle } from "d3-array";
import _ from "lodash";

const chance = new Chance();
const random = new Random(MersenneTwister19937.autoSeed());
const seeds = [...Array(81).keys()].slice(1);
const numberOfPicked = 20;

const shuffleThenPickOut20ByChance = () => chance.pickset(seeds, numberOfPicked);

const random20UniqueNumbersByChance = () => chance.unique(chance.natural, numberOfPicked, { min: 1, max: 80 });

const shuffleThenPickOut20ByRandomJs = () => random.shuffle([...seeds]).slice(0, numberOfPicked);

const randomlyPick20NumbersByRandomJs = () => random.sample(seeds, numberOfPicked);

const algorithms = [
    shuffleThenPickOut20ByChance,
    random20UniqueNumbersByChance,
    shuffleThenPickOut20ByRandomJs,
    randomlyPick20NumbersByRandomJs,
];

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

const random1 = () => {
    const randomSelection = chance.natural({
        min: 0,
        max: algorithms.length - 1,
    });

    const result = algorithms[randomSelection]();
    return result.sort((pre, next) => pre - next);
};

const random2 = () => {
    return d3Shuffle(d3Shuffle(d3Shuffle(seeds))).slice(0, numberOfPicked);
};

const random3 = () => _.shuffle(_.shuffle(_.shuffle(seeds))).slice(0, numberOfPicked);

const randomModes = {
    1: [random1],
    2: [random2],
    3: [random3],
};

export const generateResult = (randomMode) => {
    const randomShuffles = randomModes[randomMode] || randomModes[1];

    return {
        blue: chance.pickone(randomShuffles)(),
        red: chance.pickone(randomShuffles)(),
    };
};

export const getSettlementResult = (totalPoints) => {
    return settlementResultRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(totalPoints);

        return result;
    }, {});
};
