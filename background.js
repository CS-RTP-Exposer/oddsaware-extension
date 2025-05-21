const injected = [];

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  const url = details.url;

  if (url.includes("csgoroll.com/pvp/") && !injected.includes('roll')) {
    injected.push('roll');
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["roll_content.js"]
    });
  } else if (url.includes("csgoroll.com/boxes/") && !injected.includes('roll_solo')) {
    injected.push('roll_solo');
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["roll_solo_content.js"]
    });
  }
});