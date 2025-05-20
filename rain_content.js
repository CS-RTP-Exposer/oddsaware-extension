function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const selector = 'div.sc-f63de73e-0.fpLCpR.sc-8a2a066d-0.sc-966e8c9f-2.cLbUSF.jsgiUg > svg';

['click'].forEach(eventType => {
    document.addEventListener(eventType, async (event) => {
        const anchor = event.target.closest(selector);
        if (anchor) {

            const secondParent = anchor.parentElement?.parentElement;
            const cost = parseFloat(secondParent.innerText.split('\n')[1].replace(',', ''));

            let wrapper = document.querySelector('.sc-e7c49748-0.jWvhCG');
            let items = null;

            while (wrapper === null) {
                wrapper = document.querySelector('.sc-e7c49748-0.jWvhCG');
                await sleep(10);
            }

            while (items === null) {
                items = wrapper.querySelectorAll('.sc-78e8d11f-0');
                await sleep(10);
            }

            let totalRtp = 0;
            let totalPercentage = 0;
            let profitPercentage = 0;
            let avgReturn = 0;
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
                avgReturn += item.value * ((item.percentage * 100 / profitPercentage) / 100);
            });

            const rtp = (totalRtp / cost) * 100;
            const avgProfit = (avgReturn - cost);
            totalPercentage = Math.round(totalPercentage);

            const siblingElement = wrapper.parentElement?.parentElement.querySelector('div');
            const existingRtp = siblingElement.querySelector('.custom-rtp');
            const existingProfit = siblingElement.querySelector('.profit');

            if (existingRtp) existingRtp.remove();
            if (existingProfit) existingProfit.remove();

            const rtpElement = document.createElement('div');
            rtpElement.className = 'custom-rtp';
            rtpElement.style.padding = '0px 24px';
            rtpElement.style.fontWeight = 'bold';
            rtpElement.style.display = 'block';
            rtpElement.style.color = totalPercentage !== 1 ? 'red' : rtp >= 100 ? 'green' : rtp >= 80 ? 'orange' : 'red';
            rtpElement.innerText = totalPercentage !== 1 ? `Total percentage is not 100%` : `RTP: ${rtp.toFixed(2)}%`;

            const profitElement = document.createElement('div');
            profitElement.className = 'profit';
            profitElement.style.padding = '8px 0px 24px 24px';
            profitElement.style.fontWeight = 'bold';
            profitElement.style.display = 'block';
            profitElement.style.color = profitPercentage >= 0.5 ? 'green' : 'red';
            profitElement.innerText = `Chance at profit: ${(profitPercentage * 100).toFixed(2)}% (avg. profit of ${(avgProfit / cost).toFixed(2)}x)`;

            siblingElement.insertAdjacentElement('afterend', profitElement);
            siblingElement.insertAdjacentElement('afterend', rtpElement);

        }
    }, true);
});
