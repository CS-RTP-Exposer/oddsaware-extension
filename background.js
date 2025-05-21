const scriptMapping = [
  { match: "csgoroll.com/pvp/", script: "roll_content.js" },
  { match: "csgoroll.com/boxes/", script: "roll_solo_content.js" },
  { match: "rain.gg/games/case-battles", script: "rain_content.js" },
  { match: "rain.gg/games/case-opening", script: "rain_solo_content.js" }
];

// Tracks what has been injected per tab
const injectedTabs = {};

function injectIfNeeded(details) {
  const url = details.url;
  const tabId = details.tabId;

  for (const { match, script } of scriptMapping) {
    if (url.includes(match)) {
      const tabKey = `${tabId}-${match}`;

      if (injectedTabs[tabKey]) return;

      chrome.scripting.executeScript({
        target: { tabId },
        files: [script]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Script injection failed:', chrome.runtime.lastError.message);
        } else {
          injectedTabs[tabKey] = true;
          console.log(`✅ Injected ${script} into tab ${tabId}`);
        }
      });

      break;
    }
  }
}

// Handles SPA route changes
chrome.webNavigation.onHistoryStateUpdated.addListener(injectIfNeeded, {
  url: scriptMapping.map(({ match }) => ({ urlContains: match }))
});

// Handles full page loads or reloads
chrome.webNavigation.onCompleted.addListener(injectIfNeeded, {
  url: scriptMapping.map(({ match }) => ({ urlContains: match }))
});
