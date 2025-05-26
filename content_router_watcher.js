let lastUrl = location.href;

function handleUrlChange(url) {
  chrome.runtime.sendMessage({ type: "urlChanged", url });
}

// Wait for full load before initial notification
window.addEventListener('load', () => {
  lastUrl = location.href;
  window.removeOddsNotification();
  handleUrlChange(lastUrl);
});

// For SPA navigations (popstate, pushState, replaceState)
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    window.removeOddsNotification();
    handleUrlChange(lastUrl);
  }
});
observer.observe(document, { subtree: true, childList: true });

['popstate', 'pushState', 'replaceState'].forEach(eventName => {
  window.addEventListener(eventName, () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      handleUrlChange(lastUrl);
    }
  });
});
