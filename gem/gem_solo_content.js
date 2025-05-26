(() => {

    if (window.__GEM_SOLO_LOADED__) return;
    window.__GEM_SOLO_LOADED__ = true;

    if (!window.lastUrl) window.lastUrl = location.href;

    async function calculateRTP() {

        if (document.querySelector('.custom-rtp') || document.querySelector('.profit')) return;

        let wrapper = document.querySelector('div.v-card.v-card--flat.v-theme--dark.v-card--border.bg-darkgrey800.border-darkgrey500.v-card--density-default.rounded-lg.v-card--variant-elevated.item-card.d-flex.flex-column.align-space-between');
        let cost = null;
        let itemElems = null;

        while (wrapper === null) {
            wrapper = document.querySelector('div.v-card.v-card--flat.v-theme--dark.v-card--border.bg-darkgrey800.border-darkgrey500.v-card--density-default.rounded-lg.v-card--variant-elevated.item-card.d-flex.flex-column.align-space-between');
            await sleep(10);
        }
        wrapper = wrapper.parentElement;

        while (cost === null || itemElems === null || itemElems.length === 0) {
            cost = document.querySelector('div.v-col-md-auto.v-col-lg-absolute-center.order-md-3.order-lg-2.v-col-auto.order-2.text-sm-right.text-lg-center');
            itemElems = wrapper.querySelectorAll('div.v-card');
            await sleep(10);
        }

        cost = parseFloat(cost.innerText.split('\n')[1].replace(',', ''));

        let items = [];
        itemElems.forEach(item => {

            const itemValues = item.innerText.split('\n');
            const percentageIndex = itemValues[0].includes('%') ? 0 : 1;
            const percentage = parseFloat(itemValues[percentageIndex].substring(0, itemValues[percentageIndex].length - 1)) / 100;
            const value = parseFloat(itemValues[itemValues.length - 1].replace(',', ''));

            items.push({ value, percentage });

        });

        const { rtp, totalPercentage, profitPercentage, avgReturn } = window.calculateRTP(cost, items);
        window.sendOddsNotification(rtp, totalPercentage, profitPercentage, avgReturn, cost);
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