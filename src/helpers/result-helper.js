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
    player: ({ totalPlayer, totalBanker }) => totalPlayer > totalBanker,
    banker: ({ totalPlayer, totalBanker }) => totalBanker > totalPlayer,
    tie: ({ totalPlayer, totalBanker }) => totalPlayer === totalBanker,
    big: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1621,
    small: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker < 1621,
    odd: ({ totalPlayer, totalBanker }) => (totalPlayer + totalBanker) % 2 === 1,
    even: ({ totalPlayer, totalBanker }) => (totalPlayer + totalBanker) % 2 === 0,
    red: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker <= 1358,
    orange: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1359 && totalPlayer + totalBanker <= 1469,
    yellow: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1470 && totalPlayer + totalBanker <= 1570,
    green: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1571 && totalPlayer + totalBanker <= 1669,
    blue: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1670 && totalPlayer + totalBanker <= 1770,
    indigo: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1771 && totalPlayer + totalBanker <= 1881,
    violet: ({ totalPlayer, totalBanker }) => totalPlayer + totalBanker >= 1882 && totalPlayer + totalBanker <= 2820,
    playerBig: ({ totalPlayer }) => totalPlayer >= 811,
    playerSmall: ({ totalPlayer }) => totalPlayer < 811,
    bankerBig: ({ totalBanker }) => totalBanker >= 811,
    bankerSmall: ({ totalBanker }) => totalBanker < 811,
});

export const generateResult = () => {
    return {
        player: getRandom20Numbers(),
        banker: getRandom20Numbers(),
    };
};

export const getSettlementResult = (totalPoints) => {
    return settlementResultRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(totalPoints);

        return result;
    }, {});
};
