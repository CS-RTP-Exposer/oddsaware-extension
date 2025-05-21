let lastUrl = location.href;

async function removeElements() {
    let targetDiv = document.querySelector('main > div > div.sc-f63de73e-0.dNqLFf');

    while (targetDiv === null) {
        targetDiv = document.querySelector('main > div > div.sc-f63de73e-0.dNqLFf');
        await sleep(10);
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
removeElements();

new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        onUrlChange(currentUrl);
    }
}).observe(document, { subtree: true, childList: true });

function onUrlChange(url) {
    if (url === 'https://rain.gg/games/case-opening') {
        removeElements();
    }
}