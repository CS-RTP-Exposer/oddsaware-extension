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

            const siblingElement = wrapper.querySelector('img.align-self-center');
            const existingRtp = wrapper.querySelectorAll('.custom-rtp');
            const existingProfit = wrapper.querySelectorAll('.profit');

            existingRtp.forEach(el => el.remove());
            existingProfit.forEach(el => el.remove());

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
            profitElement.innerText = `Chance at profit: ${(profitPercentage * 100).toFixed(2)}% (avg. profit of ${(avgReturn / cost).toFixed(2)}x)`;

            siblingElement.insertAdjacentElement('afterend', profitElement);
            siblingElement.insertAdjacentElement('afterend', rtpElement);

        }
    });

})();


