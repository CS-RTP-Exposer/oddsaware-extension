//TODO : When urls array grows, figure out a better way to handle this

const injected = [];
const urls = [
    "csgoroll.com/pvp/*",
    "csgoroll.com/boxes/*",
    "rain.gg/games/case-battles",
    "rain.gg/games/case-opening",
];

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    const url = details.url;
    let index = null;

    for (let i = 0; i < urls.length; i++) {
        index = url.includes(urls[i]) ? i : index;
        if (index !== null) break;
    }

    if (injected.includes(urls[index])) return;

    switch(index) {
        case 0:
            injected.push(urls[index]);
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ["roll_content.js"]
            });
            break;
        case 1:
            injected.push(urls[index]);
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ["roll_solo_content.js"]
            });
            break;
        case 2:
            injected.push(urls[index]);
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ["rain_content.js"]
            });
            break;
        case 3:
            injected.push(urls[index]);
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ["rain_solo_content.js"]
            });
            break;
        default:
            break;
    }
});