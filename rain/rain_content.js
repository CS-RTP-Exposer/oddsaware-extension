(() => {

    if (window.__RAIN_LOADED__) return;
    window.__RAIN_LOADED__ = true;

    const selector = 'div.sc-f63de73e-0.fpLCpR.sc-8a2a066d-0.sc-966e8c9f-2.cLbUSF.jsgiUg > svg';

    ['click'].forEach(eventType => {
        document.addEventListener(eventType, async (event) => {
            const anchor = event.target.closest(selector);
            if (anchor) {

                const secondParent = anchor.parentElement?.parentElement;
                const cost = parseFloat(secondParent.innerText.split('\n')[1].replace(',', ''));
                const { wrapper, itemElems } = await getItems('.sc-e7c49748-0.jWvhCG', '.sc-78e8d11f-0');

                let items = [];
                itemElems.forEach(item => {

                    const itemValues = item.innerText.split('\n');
                    const percentage = parseFloat(itemValues[0].substring(0, itemValues[0].length - 1)) / 100;
                    const value = parseFloat(itemValues[itemValues.length - 1].replace(',', ''));

                    items.push({ value, percentage });

                });

                const { rtp, totalPercentage, profitPercentage, avgReturn } = window.calculateRTP(cost, items);
                window.sendOddsNotification(rtp, totalPercentage, profitPercentage, avgReturn, cost);

            }
        }, true);
    });


})();