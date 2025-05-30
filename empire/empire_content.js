(() => {

    if (window.__CSGOEMPIRE_LOADED__) return;
    window.__CSGOEMPIRE_LOADED__ = true;

    ['click'].forEach(eventType => {
        document.addEventListener(eventType, async (event) => {
            const anchor = event.target.closest('div.absolute > div > svg');
            if (anchor) {

                const secondParent = anchor.parentElement?.parentElement?.parentElement;
                const cost = parseFloat(secondParent.querySelector('div > span').innerText.replace(',', ''));
                const { wrapper, itemElems } = await getItems('div.scroll-y.grid', '.scroll-y > div');

                let items = [];
                itemElems.forEach(item => {

                    const itemValues = item.innerText.split('\n');
                    const percentage = parseFloat(itemValues[itemValues.length - 1].substring(0, itemValues[itemValues.length - 1].length - 1)) / 100;
                    const value = parseFloat(itemValues[itemValues.length - 3].replace(',', ''));

                    items.push({ value, percentage });

                });

                const { rtp, totalPercentage, profitPercentage, avgReturn } = window.calculateRTP(cost, items);
                window.sendOddsNotification(rtp, totalPercentage, profitPercentage, avgReturn, cost);

            }
        }, true);
    });

})();


