(() => {

    if (window.__RAIN_SOLO_LOADED__) return;
    window.__RAIN_SOLO_LOADED__ = true;

    if (!window.lastUrl) window.lastUrl = location.href;

    async function removeElements() {
        let targetDiv = document.querySelector('main > div > div.sc-f63de73e-0.dNqLFf');

        while (targetDiv === null) {
            targetDiv = document.querySelector('main > div > div.sc-f63de73e-0.dNqLFf');
            await window.sleep(10);
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    let elemsToRemove = document.querySelectorAll('div.sc-f63de73e-0.fpLCpR.sc-8a2a066d-0.sc-d9f8ad01-3.cLbUSF.eqGvSG > svg');
                    elemsToRemove.forEach(elem => elem.remove());
                }
            }
        });

        observer.observe(targetDiv, {
            childList: true
        });
    }

    async function calculateRTP() {

        if (document.querySelector('.custom-rtp') || document.querySelector('.profit')) return;

        let wrapper = document.querySelector('div.sc-f63de73e-0.bILPKE');
        let cost = null;
        let itemElems = null;

        while (wrapper === null) {
            wrapper = document.querySelector('div.sc-f63de73e-0.bILPKE');
            await window.sleep(10);
        }

        while (cost === null || itemElems === null || itemElems.length === 0) {
            cost = document.querySelector('div.sc-b69e8a97-0.cKiNwf');
            itemElems = wrapper.querySelectorAll('div.sc-f63de73e-0.bILPKE > div.sc-78e8d11f-0');
            await window.sleep(10);
        }

        cost = parseFloat(cost.innerText);

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

    if (window.location.href === 'https://rain.gg/games/case-opening') {
        removeElements();
    }

    if (window.location.href.startsWith('https://rain.gg/games/case-opening/')) {
        calculateRTP();
    }

    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== window.lastUrl) {
            window.lastUrl = currentUrl;
            onUrlChange(currentUrl);
        }
    }).observe(document, { subtree: true, childList: true });

    function onUrlChange(url) {
        if (url === 'https://rain.gg/games/case-opening') removeElements();
        if (url.startsWith('https://rain.gg/games/case-opening/')) calculateRTP();
    }
})();
