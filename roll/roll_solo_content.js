(() => {

    if (window.__CSGOROLL_SOLO_LOADED__) return;
    window.__CSGOROLL_SOLO_LOADED__ = true;

    if (!window.lastUrl) window.lastUrl = location.href;

    document.addEventListener('click', async (event) => {
        const anchor = event.target.closest('button.open-btn');

        if (anchor && anchor.innerText.toLowerCase() === 'open case') {
            const wrapper = anchor.parentElement;
            const slug = wrapper.innerText.split('\n')[0].replace(' ', '-').toLowerCase();

            const url = `/boxes/view/world/${slug}`;
            const link = document.querySelector(`a[href="${url}"]`);

            if (link) link.click();

            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
    });

    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== window.lastUrl) {
            window.lastUrl = currentUrl;
            onUrlChange(currentUrl);
        }
    }).observe(document, { subtree: true, childList: true });

    function onUrlChange(url) {
        console.log('URL changed to:', url);
        if (url.startsWith('https://www.csgoroll.com/boxes/view/')) {
            calculateRTP();
        }
    }

    window.addEventListener('load', () => {
        if (window.location.href.startsWith('https://www.csgoroll.com/boxes/view/')) {
            calculateRTP();
        }
    });

    async function calculateRTP() {

        if (document.querySelector('.custom-rtp') || document.querySelector('.profit')) return;
        if (!window.location.href.startsWith('https://www.csgoroll.com/boxes/view/')) return;

        let wrapper = document.querySelector('section.gap-05.grid');
        let cost = null;
        let itemElems = null;

        while (wrapper === null) {
            wrapper = document.querySelector('section.gap-05.grid');
            await window.sleep(10);
        }

        while (cost === null || itemElems === null || itemElems.length === 0) {
            cost = document.querySelector('button.mat-focus-indicator.mat-raised-button.mat-button-base.mat-button-3d.open-btn.mat-accent.ng-star-inserted');
            itemElems = wrapper.querySelectorAll('cw-item');
            await window.sleep(10);
        }

        cost = parseFloat(cost.innerText.split('\n')[1].replace(',', ''));

        let items = [];
        itemElems.forEach(item => {
            const itemValues = item.innerText.split('\n');
            let percentage = item.parentElement.querySelector('.rate.visible').innerText;
            percentage = parseFloat(percentage.substring(0, percentage.length - 1)) / 100;
            const value = parseFloat(itemValues[itemValues.length - 1].replace(',', ''));

            items.push({ value, percentage });
        });

        const { rtp, totalPercentage, profitPercentage, avgReturn } = window.calculateRTP(cost, items);

        window.sendOddsNotification(rtp, totalPercentage, profitPercentage, avgReturn, cost);

        const siblingElement = document.querySelector('h4').parentElement;
        const existingRtp = wrapper.querySelector('.custom-rtp');
        const existingProfit = wrapper.querySelector('.profit');

        if (existingRtp) existingRtp.remove();
        if (existingProfit) existingProfit.remove();

        const rtpElement = document.createElement('div');
        rtpElement.className = 'custom-rtp';
        rtpElement.style.marginTop = '8px';
        rtpElement.style.fontWeight = 'bold';
        rtpElement.style.color = totalPercentage !== 1 ? 'red' : rtp >= 100 ? 'green' : rtp >= 80 ? 'orange' : 'red';
        rtpElement.innerText = totalPercentage !== 1
            ? `Total percentage is not 100%`
            : `RTP: ${rtp.toFixed(2)}%`;

        const profitElement = document.createElement('div');
        profitElement.className = 'profit';
        profitElement.style.marginTop = '-8px';
        profitElement.style.fontWeight = 'bold';
        profitElement.style.color = profitPercentage >= 0.5 ? 'green' : 'red';
        profitElement.innerText = `Chance at profit: ${(profitPercentage * 100).toFixed(2)}% (avg. profit of ${(avgReturn / cost).toFixed(2)}x)`;

        siblingElement.insertAdjacentElement('afterend', profitElement);
        siblingElement.insertAdjacentElement('afterend', rtpElement);
    }
})();
