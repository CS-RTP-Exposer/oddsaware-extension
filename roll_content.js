function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Luister naar klik op de gewenste <a class="img-container">
document.addEventListener('click', async (event) => {
    const anchor = event.target.closest('a.img-container');
    if (anchor) {

        let wrapper = document.querySelector('.box-details-side-caption');
        let cost = null;
        let items = null;

        while (wrapper === null) {
            wrapper = document.querySelector('.box-details-side-caption');
            await sleep(10);
        }

        while (cost === null || items === null) {
            cost = parseFloat(wrapper.querySelector('.currency-value').innerText.replace(',', ''));
            items = wrapper.querySelectorAll('.w-50');
            await sleep(10);
        }

        let totalRtp = 0;
        let totalPercentage = 0;
        let profitPercentage = 0;
        let avgProfit = 0;
        let profitItems = [];

        items.forEach(item => {

            const itemValues = item.innerText.split('\n');
            const percentage = parseFloat(itemValues[0].substring(0, itemValues[0].length - 1)) / 100;
            const value = parseFloat(itemValues[itemValues.length - 1].replace(',', ''));

            totalPercentage += percentage;
            totalRtp += value * percentage;

            if (value >= cost) {
                profitPercentage += percentage;
                profitItems.push({ value, percentage });
            }

        });

        profitItems.forEach(item => {
            avgProfit += item.value * ((item.percentage * 100 / profitPercentage) / 100);
        });

        const rtp = (totalRtp / cost) * 100;
        totalPercentage = Math.round(totalPercentage);
        avgProfit = (avgProfit - cost);

        const siblingElement = wrapper.querySelector('img.align-self-center');
        const existingRtp = wrapper.querySelector('.custom-rtp');
        const existingProfit = wrapper.querySelector('.profit');

        if (existingRtp) existingRtp.remove();
        if (existingProfit) existingProfit.remove();

        const rtpElement = document.createElement('div');
        rtpElement.className = 'custom-rtp';
        rtpElement.style.marginTop = '8px';
        rtpElement.style.fontWeight = 'bold';
        rtpElement.style.color = totalPercentage !== 1 ? 'red' : rtp >= 100 ? 'green' : rtp >= 80 ? 'orange' : 'red';
        rtpElement.innerText = totalPercentage !== 1 ? `Total percentage is not 100%` : `RTP: ${rtp.toFixed(2)}%`;

        const profitElement = document.createElement('div');
        profitElement.className = 'profit';
        profitElement.style.marginBottom = '8px';
        profitElement.style.fontWeight = 'bold';
        profitElement.style.color = profitPercentage >= 0.5 ? 'green' : 'red';
        profitElement.innerText = `Chance at profit: ${(profitPercentage * 100).toFixed(2)}% (avg. profit of ${(avgProfit / cost).toFixed(2)}x)`;

        siblingElement.insertAdjacentElement('afterend', profitElement);
        siblingElement.insertAdjacentElement('afterend', rtpElement);

    }
});


