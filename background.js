const urlScriptMap = {
    "csgoroll.com/pvp/": "roll/roll_content.js",
    "csgoroll.com/boxes/": "roll/roll_solo_content.js",
    "rain.gg/games/case-battles": "rain/rain_content.js",
    "rain.gg/games/case-opening": "rain/rain_solo_content.js",
    "https://csgogem.com/games/battles/": "gem/gem_content.js",
    "https://csgogem.com/games/cases/": "gem/gem_solo_content.js"
};

const supportedSites = [
    "csgoroll.com",
    "rain.gg",
    "csgogem.com",
];

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    const url = details.url;
    let siteHit = false;
    let gameHit = false;

    for (const site of supportedSites) {
        if (url.includes(site)) {
            siteHit = true;
            console.log(`Supported site detected: ${site}`);
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['utils.js', 'send_site_notification.js'],
            });
            break; // Stop checking after first match
        }
    }

    for (const [urlPattern, scriptFile] of Object.entries(urlScriptMap)) {
        if (url.includes(urlPattern)) {
            gameHit = true;
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['utils.js', 'send_game_notification.js', scriptFile],
            });
            break; // Stop checking after first match
        }
    }

    if(!siteHit) return;
    if(gameHit) return;

    console.log(`No matching game script found for URL: ${url}`);
    // no matching games found, remove any existing game notifications
    
    chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['utils.js', 'remove_game_notification.js'],
        });
});
