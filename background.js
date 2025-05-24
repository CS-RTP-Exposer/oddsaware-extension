const urlScriptMap = {
    "csgoroll.com/pvp/": "roll/roll_content.js",
    "csgoroll.com/boxes/": "roll/roll_solo_content.js",
    "rain.gg/games/case-battles": "rain/rain_content.js",
    "rain.gg/games/case-opening": "rain/rain_solo_content.js",
    "https://csgogem.com/games/battles/": "gem/gem_content.js",
    "https://csgogem.com/games/cases/": "gem/gem_solo_content.js",
    "https://csgogem.com/games/cases": "", // No script needed for this URL
    "https://csgogem.com/games/battles": "" // No script needed for this URL
};

const supportedSites = [
    "csgoroll.com",
    "rain.gg",
    "csgogem.com"
];

const tabSiteState = new Map();

function getDomainFromUrl(url) {
    try {
        const { hostname } = new URL(url);
        return hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}

function handleNavigation(tabId, url) {
    const currentDomain = getDomainFromUrl(url);
    if (!currentDomain) return;

    let siteHit = false;
    let gameHit = false;

    const lastState = tabSiteState.get(tabId);
    const domainChanged = !lastState || lastState.domain !== currentDomain;

    if (domainChanged) {
        tabSiteState.set(tabId, { domain: currentDomain, notified: false });
    }

    for (const site of supportedSites) {
        if (url.includes(site)) {
            siteHit = true;
            const siteState = tabSiteState.get(tabId);
            if (!siteState.notified) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['utils.js', 'notifications/send_site_notification.js']
                });
                tabSiteState.set(tabId, { domain: currentDomain, notified: true });
            }
            break;
        }
    }

    for (const [urlPattern, scriptFile] of Object.entries(urlScriptMap)) {
        if (url.includes(urlPattern)) {
            gameHit = true;
            if (!scriptFile) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['utils.js', 'notifications/send_game_notification.js']
                });
                break;
            }
            chrome.scripting.executeScript({
                target: { tabId },
                files: ['utils.js', 'notifications/send_game_notification.js', scriptFile]
            });
            break;
        }
    }

    if (!siteHit || gameHit) return;

    chrome.scripting.executeScript({
        target: { tabId },
        files: ['utils.js', 'remove_game_notification.js']
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "urlChanged" && sender.tab) {
        handleNavigation(sender.tab.id, message.url);
    }
});
