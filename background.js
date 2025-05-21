const urlScriptMap = {
  "csgoroll.com/pvp/": "roll_content.js",
  "csgoroll.com/boxes/": "roll_solo_content.js",
  "rain.gg/games/case-battles": "rain_content.js",
  "rain.gg/games/case-opening": "rain_solo_content.js",
};

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  const url = details.url;

  for (const [urlPattern, scriptFile] of Object.entries(urlScriptMap)) {
    if (url.includes(urlPattern)) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: [scriptFile],
      });
      break; // Stop checking after first match
    }
  }
});
