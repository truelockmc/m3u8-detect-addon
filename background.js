browser.runtime.onInstalled.addListener(initBadge);
browser.runtime.onStartup.addListener(initBadge);

function initBadge() {
  browser.action.setBadgeText({ text: '' });
}

const foundLinks = new Set();

browser.webRequest.onBeforeRequest.addListener(
  details => {
    const url = details.url;
    if (
      (url.includes("player.videasy.net/") || url.includes(".m3u8")) &&
      !url.includes("chunks") &&
      !url.includes(".ico") &&
      !url.includes(".wasm") &&
      !url.includes(".js") &&
      !url.includes(".css") &&
      !foundLinks.has(url)
    ) {
      foundLinks.add(url);

      browser.action.setBadgeText({ text: 'New', tabId: details.tabId });
      browser.action.setBadgeBackgroundColor({ color: '#0f0', tabId: details.tabId });

      if (url.endsWith(".m3u8")) {
        browser.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-48.png",
          title: "M3U8-URL detected",
          message: `A new .m3u8 Link was detected: ${url}`
        });
      }
    }
  },
  { urls: ["<all_urls>"] },
  []
);

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getLinks") {
    sendResponse({ links: Array.from(foundLinks) });
  }
});
