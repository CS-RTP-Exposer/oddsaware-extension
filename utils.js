function calculateRTP(cost, items) {

    let totalRtp = 0;
    let totalPercentage = 0;
    let profitPercentage = 0;
    let avgReturn = 0;
    let profitItems = [];

    items.forEach(item => {

        const percentage = item.percentage;
        const value = item.value;

        totalPercentage += percentage;
        totalRtp += value * percentage;

        console.log(value, percentage);

        if (value >= cost) {
            profitPercentage += percentage;
            profitItems.push({ value, percentage });
        }

    });

    profitItems.forEach(item => {
        avgReturn += item.value * ((item.percentage * 100 / profitPercentage) / 100);
    });

    const rtp = (totalRtp / cost) * 100;
    totalPercentage = Math.round(totalPercentage);

    return { rtp, totalPercentage, profitPercentage, avgReturn };

}