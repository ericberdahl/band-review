const countMap = [
    { min: 12, max: 12, cite: "a dozen" },
    { min: 13, max: 15, cite: "more than a dozen" },
    { min: 17, max: 19, cite: "nearly a score of" },
    { min: 20, max: 20, cite: "a score of" },
    { min: 24, max: 24, cite: "two dozen" },
    { min: 25, max: 27, cite: "more than two dozen" },
    { min: 28, max: 29, cite: "nearly thirty" },
    { min: 31, max: 32, cite: "more than thirty" },
    { min: 33, max: 35, cite: "nearly three dozen" },
    { min: 36, max: 36, cite: "three dozen" },
    { min: 37, max: 39, cite: "nearly two score" },
    { min: 40, max: 40, cite: "two score" },
];

function computeNumericCitation(count)
{
    const found = countMap.find((cite) => (cite.min <= count && count <= cite.max));
    return (found ? found.cite : count);
}

module.exports = computeNumericCitation;
