(() => {

    if (window.__UTILS_LOADED__) return;
    window.__UTILS_LOADED__ = true;

    window.sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // CALCULATE RTP
    window.calculateRTP = (cost, items) => {

        let totalRtp = 0;
        let totalPercentage = 0;
        let profitPercentage = 0;
        let avgReturn = 0;
        let profitItems = [];

        items.forEach(item => {

            const percentage = item.percentage;
            const value = item.value;

            totalPercentage += percentage;
            totalRtp += value * percentage;

            console.log(value, percentage);

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

        return { rtp, totalPercentage, profitPercentage, avgReturn };

    }

    // GET ITEMS
    window.getItems = async (wrapperSelector, itemSelector) => {
        let wrapper = document.querySelector(wrapperSelector);
        let itemElems = null;

        while (wrapper === null) {
            wrapper = document.querySelector(wrapperSelector);
            await sleep(10);
        }

        while (itemElems === null) {
            itemElems = wrapper.querySelectorAll(itemSelector);
            await sleep(10);
        }

        return { wrapper, itemElems };
    }

    // INJECTION NOTIFICATION
    window.sendInjectedNotification = () => {
        const body = document.querySelector('body');
        const logoUrl = chrome.runtime.getURL('public/oddsaware.svg');

        if(document.getElementById('injected-notification-toast')) document.getElementById('injected-notification-toast').remove();

        // Create toast container if it doesn't exist
        let container = document.getElementById('custom-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'custom-toast-container';
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '10px';
            container.style.zIndex = '99999';
            body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.id = 'injected-notification-toast';
        toast.style.position = 'relative';
        toast.style.padding = '15px 20px 25px'; // bottom padding for progress bar
        toast.style.backgroundColor = 'rgba(139, 92, 246, 1)'; // Tailwind purple-500
        toast.style.color = 'white';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        toast.style.fontFamily = 'sans-serif';
        toast.style.minWidth = '350px';
        toast.style.maxWidth = '350px';
        toast.style.display = 'flex';
        toast.style.justifyContent = 'space-between';
        toast.style.alignItems = 'center';
        toast.style.gap = '12px';
        toast.style.overflow = 'hidden';

        toast.innerHTML = `
            <div style="flex-grow: 1;">
                <h5 style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <img src="${logoUrl}" alt="OddsAware Logo" style="height: 20px; width: 20px;" />
                    <span style="font-size: 16px;">OddsAware</span>
                </h5>
                <strong>You have navigated to a supported site!</strong>
                <p style="margin-top: 8px; margin-bottom: 8px;">Good for you, we will now automatically calculate your odds for the following games:</p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>CASE BATTLES</li>
                    <li>UNBOXING</li>
                </ul>
            </div>
            <button type="button" style="
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                line-height: 1;
            " aria-label="Close">&times;</button>`;

        // Dismiss button functionality
        toast.querySelector('button').onclick = () => toast.remove();

        // Create progress bar
        const progress = document.createElement('div');
        progress.style.position = 'absolute';
        progress.style.bottom = '0';
        progress.style.left = '0';
        progress.style.height = '4px';
        progress.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        progress.style.width = '100%';
        progress.style.transition = 'width 30s linear';

        toast.appendChild(progress);
        container.appendChild(toast);

        // Animate the progress bar AFTER it is in the DOM
        setTimeout(() => {
            progress.style.width = '0%';
        }, 50);

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            toast.remove();
        }, 30000);
    };

    // SUPPORTED GAME NOTIFICATION
    window.sendSupportedGameNotification = () => {
        const body = document.querySelector('body');
        const logoUrl = chrome.runtime.getURL('public/oddsaware.svg');

        // Create toast container if it doesn't exist
        let container = document.getElementById('custom-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'custom-toast-container';
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '10px';
            container.style.zIndex = '99999';
            body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.id = 'supported-game-toast';
        toast.style.position = 'relative';
        toast.style.padding = '15px 20px';
        toast.style.backgroundColor = 'rgba(139, 92, 246, 1)';
        toast.style.color = 'white';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        toast.style.fontFamily = 'sans-serif';
        toast.style.minWidth = '350px';
        toast.style.maxWidth = '400px';
        toast.style.display = 'flex';
        toast.style.justifyContent = 'space-between';
        toast.style.alignItems = 'flex-start';
        toast.style.gap = '12px';
        toast.style.overflow = 'hidden';
        toast.style.transition = 'all 0.3s ease';

        toast.innerHTML = `
        <div class="toast-content" style="flex-grow: 1;">
            <h5 style="display: flex; align-items: center; gap: 8px;">
                <img src="${logoUrl}" alt="OddsAware Logo" style="height: 20px; width: 20px;" />
                <span style="font-size: 16px;">OddsAware</span>
            </h5>
            <strong>Supported Game Detected!</strong>
        </div>
        <button type="button" class="collapse-btn" style="
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            line-height: 1;
            padding-left: 5px;
        " title="Collapse">&#x25B2;</button>
    `;

        const collapseBtn = toast.querySelector('.collapse-btn');
        const content = toast.querySelector('.toast-content');

        let collapsed = false;

        collapseBtn.onclick = () => {
            collapsed = !collapsed;

            if (collapsed) {
                // Collapse: hide content, shrink size, change icon
                content.style.display = 'none';
                toast.style.minWidth = 'unset';
                toast.style.width = '40px';
                toast.style.height = '40px';
                toast.style.padding = '10px';
                toast.style.justifyContent = 'center';
                toast.style.alignItems = 'center';
                collapseBtn.innerHTML = `<img src="${logoUrl}" alt="OddsAware Logo" style="height: 20px; width: 20px;" />`;
                collapseBtn.title = "Expand";
                collapseBtn.style.paddingLeft = '0';
            } else {
                // Expand: restore content
                content.style.display = 'block';
                toast.style.minWidth = '350px';
                toast.style.width = '';
                toast.style.height = '';
                toast.style.padding = '15px 20px';
                toast.style.justifyContent = 'space-between';
                toast.style.alignItems = 'flex-start';
                collapseBtn.innerHTML = '&#x25B2;';
                collapseBtn.title = "Collapse";
            }
        };

        container.appendChild(toast);
    };

    // REMOVE GAME NOTIFICATION
    window.removeGameNotification = () => {
        const toast = document.getElementById('supported-game-toast');
        if (toast) toast.remove();
    };





})();
