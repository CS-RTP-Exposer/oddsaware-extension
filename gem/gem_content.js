(() => {

    if (window.__GEM_LOADED__) return;
    window.__GEM_LOADED__ = true;

    document.addEventListener("contextmenu", async (event) => {
        const anchor = event.target.closest('.case-item');
        if (anchor) {

            if (document.querySelector('.custom-rtp') || document.querySelector('.profit')) return;

            const cost = parseFloat(anchor.innerText.split('\n')[1].replace(',', ''));
            const { wrapper, itemElems } = await getItems('.item-list', '.v-card');

            let items = [];
            itemElems.forEach(item => {

                const itemValues = item.innerText.split('\n');
                const percentageIndex = itemValues[0].includes('%') ? 0 : 1;
                const percentage = parseFloat(itemValues[percentageIndex].substring(0, itemValues[percentageIndex].length - 1)) / 100;
                const value = parseFloat(itemValues[itemValues.length - 1].replaceAll(',', ''));

                items.push({ value, percentage });

            });

            const { rtp, totalPercentage, profitPercentage, avgReturn } = window.calculateRTP(cost, items);
            window.sendOddsNotification(rtp, totalPercentage, profitPercentage, avgReturn, cost);

        }
    }, true);

})();