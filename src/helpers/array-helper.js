export const sumArrayNumber = (array) => {
    return array.reduce(getSum, 0);
};

function getSum(total, number) {
    return total + number;
}
