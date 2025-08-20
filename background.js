// background.js

const foundLinks = new Set();

// Listener für Netzwerkrequests
browser.webRequest.onBeforeRequest.addListener(
  details => {
    const url = details.url;
    // Filter: Nur speichern, wenn URL player.videasy.net oder .m3u8/.wasm/.js enthält
    // UND nicht '.wasm', '.js' oder 'chunks'
    if (
      (url.includes("player.videasy.net/") || url.includes(".m3u8")) &&
      !url.includes("chunks") &&
      !url.includes(".wasm") &&
      !url.includes(".js") &&
      !foundLinks.has(url)
    ) {
      foundLinks.add(url);
      browser.runtime.sendMessage({ type: "newLink", url });
      console.log("Found", url);

      // Benachrichtigung anzeigen, wenn ein m3u8-Link erkannt wurde
      if (url.endsWith(".m3u8")) {
        browser.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-48.png",
          title: "M3U8-Link erkannt",
          message: `Ein M3U8-Link wurde erkannt: ${url}`,
        });
      }
    }
  },
  { urls: ["<all_urls>"] },
  []
);

// Listener für Nachrichten vom Popup
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "getLinks") {
    return Promise.resolve({ links: Array.from(foundLinks) });
  }
});
