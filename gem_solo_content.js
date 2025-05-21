(() => {

    if (window.__GEM_SOLO_LOADED__) return;
    window.__GEM_SOLO_LOADED__ = true;

    if (!window.lastUrl) window.lastUrl = location.href;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function calculateRTP() {

        if (document.querySelector('.custom-rtp') || document.querySelector('.profit')) return;

        let wrapper = document.querySelector('div.v-card.v-card--flat.v-theme--dark.v-card--border.bg-darkgrey800.border-darkgrey500.v-card--density-default.rounded-lg.v-card--variant-elevated.item-card.d-flex.flex-column.align-space-between');
        let cost = null;
        let items = null;

        while (wrapper === null) {
            wrapper = document.querySelector('div.v-card.v-card--flat.v-theme--dark.v-card--border.bg-darkgrey800.border-darkgrey500.v-card--density-default.rounded-lg.v-card--variant-elevated.item-card.d-flex.flex-column.align-space-between');
            await sleep(10);
        }

        wrapper = wrapper.parentElement;

        while (cost === null || items === null || items.length === 0) {
            cost = document.querySelector('div.v-col-md-auto.v-col-lg-absolute-center.order-md-3.order-lg-2.v-col-auto.order-2.text-sm-right.text-lg-center');
            items = wrapper.querySelectorAll('div.v-card');
            await sleep(10);
        }

        cost = parseFloat(cost.innerText.split('\n')[1].replace(',', ''));

        let totalRtp = 0;
        let totalPercentage = 0;
        let profitPercentage = 0;
        let avgReturn = 0;
        let profitItems = [];

        items.forEach(item => {
            const itemValues = item.innerText.split('\n');

            const percentageIndex = itemValues[0].includes('%') ? 0 : 1;

            const percentage = parseFloat(itemValues[percentageIndex].substring(0, itemValues[percentageIndex].length - 1)) / 100;
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
        totalPercentage = Math.round(totalPercentage);

        const siblingElement = document.querySelector('#__nuxt > div > div > main > div.v-container.v-locale--is-ltr.py-8.page-content > div > div:nth-child(1)');
        const existingRtp = siblingElement.querySelector('.custom-rtp');
        const existingProfit = siblingElement.querySelector('.profit');

        if (existingRtp) existingRtp.remove();
        if (existingProfit) existingProfit.remove();

        const rtpElement = document.createElement('div');
        rtpElement.className = 'custom-rtp';
        rtpElement.style.paddingLeft = '20px';
        rtpElement.style.fontWeight = 'bold';
        rtpElement.style.display = 'block';
        rtpElement.style.flex = '0 0 100%';
        rtpElement.style.color = totalPercentage !== 1 ? 'red' : rtp >= 100 ? 'green' : rtp >= 80 ? 'orange' : 'red';
        rtpElement.innerText = totalPercentage !== 1 ? `Total percentage is not 100%` : `RTP: ${rtp.toFixed(2)}%`;

        const profitElement = document.createElement('div');
        profitElement.className = 'profit';
        profitElement.style.paddingLeft = '20px';
        profitElement.style.fontWeight = 'bold';
        profitElement.style.display = 'block';
        profitElement.style.flex = '0 0 100%';
        profitElement.style.color = profitPercentage >= 0.5 ? 'green' : 'red';
        profitElement.innerText = `Chance at profit: ${(profitPercentage * 100).toFixed(2)}% (avg. profit of ${(avgReturn / cost).toFixed(2)}x)`;

        siblingElement.insertAdjacentElement('afterend', profitElement);
        siblingElement.insertAdjacentElement('afterend', rtpElement);

    }

    calculateRTP();

    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== window.lastUrl) {
            window.lastUrl = currentUrl;
            onUrlChange(currentUrl);
        }
    }).observe(document, { subtree: true, childList: true });

    function onUrlChange(url) {
        if (url.startsWith('https://csgogem.com/games/cases/')) calculateRTP();
    }
})();