// Pearson Correlation Coefficient Algorithm
function calculateCorrelation(data1, data2) {
    if (data1.length !== data2.length || data1.length === 0) return 0;

    const n = data1.length;
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;

    for (let i = 0; i < n; i++) {
        sum1 += data1[i];
        sum2 += data2[i];
        sum1Sq += data1[i] * data1[i];
        sum2Sq += data2[i] * data2[i];
        pSum += data1[i] * data2[i];
    }

    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    if (den === 0) return 0;
    return num / den;
}

module.exports = calculateCorrelation;