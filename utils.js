window.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.calculateRTP = (cost, items) => {

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

window.getItems = async (wrapperSelector, itemSelector) => {
    let wrapper = document.querySelector(wrapperSelector);
    let itemElems = null;

    while (wrapper === null) {
        wrapper = document.querySelector(wrapperSelector);
        await sleep(10);
    }

    while (itemElems === null) {
        itemElems = wrapper.querySelectorAll(itemSelector);
        await sleep(10);
    }

    return { wrapper, itemElems };
}