(() => {

    if (window.__CSGOROLL_LOADED__) return;
    window.__CSGOROLL_LOADED__ = true;

    document.addEventListener('click', async (event) => {
        const anchor = event.target.closest('a.img-container');
        if (anchor) {

            let wrapper = document.querySelector('.box-details-side-caption');
            let cost = null;
            let itemElems = null;

            while (wrapper === null) {
                wrapper = document.querySelector('.box-details-side-caption');
                await window.sleep(10);
            }

            while (cost === null || itemElems === null) {
                cost = parseFloat(wrapper.querySelector('.currency-value').innerText.replace(',', ''));
                itemElems = wrapper.querySelectorAll('.w-50');
                await window.sleep(10);
            }

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
    });

})();


