import { getSettlementResult, generateResult } from "../../../src/helpers/result-helper";

describe("settlementResult tests", () => {
    const testCases = [
        {
            result: {
                totalBlue: 720,
                totalRed: 573,
            },
            settlementResult: {
                blue: true,
                red: false,
                tie: false,
                big: false,
                small: true,
                odd: true,
                even: false,
                blueBig: false,
                blueSmall: true,
                redBig: false,
                redSmall: true,
            },
        },
        {
            result: {
                totalBlue: 718,
                totalRed: 718,
            },
            settlementResult: {
                blue: false,
                red: false,
                tie: true,
                big: false,
                small: true,
                odd: false,
                even: true,
                blueBig: false,
                blueSmall: true,
                redBig: false,
                redSmall: true,
            },
        },
        {
            result: {
                totalBlue: 871,
                totalRed: 694,
            },
            settlementResult: {
                blue: true,
                red: false,
                tie: false,
                big: false,
                small: true,
                odd: true,
                even: false,
                blueBig: true,
                blueSmall: false,
                redBig: false,
                redSmall: true,
            },
        },
        {
            result: {
                totalBlue: 644,
                totalRed: 935,
            },
            settlementResult: {
                blue: false,
                red: true,
                tie: false,
                big: false,
                small: true,
                odd: true,
                even: false,
                blueBig: false,
                blueSmall: true,
                redBig: true,
                redSmall: false,
            },
        },
        {
            result: {
                totalBlue: 806,
                totalRed: 892,
            },
            settlementResult: {
                blue: false,
                red: true,
                tie: false,
                big: true,
                small: false,
                odd: false,
                even: true,
                blueBig: false,
                blueSmall: true,
                redBig: true,
                redSmall: false,
            },
        },
        {
            result: {
                totalBlue: 818,
                totalRed: 1033,
            },
            settlementResult: {
                blue: false,
                red: true,
                tie: false,
                big: true,
                small: false,
                odd: true,
                even: false,
                blueBig: true,
                blueSmall: false,
                redBig: true,
                redSmall: false,
            },
        },
        {
            result: {
                totalBlue: 961,
                totalRed: 963,
            },
            settlementResult: {
                blue: false,
                red: true,
                tie: false,
                big: true,
                small: false,
                odd: false,
                even: true,
                blueBig: true,
                blueSmall: false,
                redBig: true,
                redSmall: false,
            },
        },
    ];

    it.each(testCases)("should return correct settlement", ({ result, settlementResult }) => {
        expect(getSettlementResult(result)).toEqual(settlementResult);
    });
});

describe("generateResult tests", () => {
    it("should return exactly 20 number for red and blue", () => {
        const result = generateResult();
        expect(result.blue.length).toEqual(20);
        expect(result.red.length).toEqual(20);
    });
});
