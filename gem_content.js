function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("contextmenu", async (event) => {
    const anchor = event.target.closest('.case-item');
    if (anchor) {

        const cost = parseFloat(anchor.innerText.split('\n')[1].replace(',', ''));

        let wrapper = document.querySelector('.item-list');
        let items = null;

        while (wrapper === null) {
            wrapper = document.querySelector('.item-list');
            await sleep(10);
        }

        while (items === null) {
            items = wrapper.querySelectorAll('.v-card');
            await sleep(10);
        }

        let totalRtp = 0;
        let totalPercentage = 0;
        let profitPercentage = 0;
        let avgReturn = 0;
        let profitItems = [];

        items.forEach(item => {

            const itemValues = item.innerText.split('\n');

            const percentageIndex = itemValues[0].includes('%') ? 0 : 1;

            const percentage = parseFloat(itemValues[percentageIndex].substring(0, itemValues[percentageIndex].length - 1)) / 100;
            const value = parseFloat(itemValues[itemValues.length - 1].replaceAll(',', ''));

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
        const avgProfit = (avgReturn - cost);
        totalPercentage = Math.round(totalPercentage);

        const siblingElement = wrapper.parentElement?.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.v-card-title');
        const existingRtp = siblingElement.querySelector('.custom-rtp');
        const existingProfit = siblingElement.querySelector('.profit');
        if (existingRtp) existingRtp.remove();
        if (existingProfit) existingProfit.remove();

        const rtpElement = document.createElement('div');
        rtpElement.className = 'custom-rtp';
        rtpElement.style.marginTop = '12px';
        rtpElement.style.marginLeft = '24px';
        rtpElement.style.fontWeight = 'bold';
        rtpElement.style.display = 'block';
        rtpElement.style.color = totalPercentage !== 1 ? 'red' : rtp >= 100 ? 'green' : rtp >= 80 ? 'orange' : 'red';
        rtpElement.innerText = totalPercentage !== 1 ? `Total percentage is not 100%` : `RTP: ${rtp.toFixed(2)}%`;

        const profitElement = document.createElement('div');
        profitElement.className = 'profit';
        profitElement.style.marginLeft = '24px';
        profitElement.style.fontWeight = 'bold';
        profitElement.style.display = 'block';
        profitElement.style.color = profitPercentage >= 0.5 ? 'green' : 'red';
        profitElement.innerText = `Chance at profit: ${(profitPercentage * 100).toFixed(2)}% (avg. profit of ${(avgProfit / cost).toFixed(2)}x)`;

        siblingElement.insertAdjacentElement('afterend', profitElement);
        siblingElement.insertAdjacentElement('afterend', rtpElement);

    }
}, true);
