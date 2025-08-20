const ul = document.getElementById("linkList");

function addLinkItem(url, isNew) {
  const li = document.createElement("li");
  li.style.paddingLeft = '2px';
  
  if (url.includes("master.m3u8") || url.includes("playlist.m3u8")) {
    const crown = document.createElement("span");
    crown.textContent = "👑 ";
    crown.style.marginRight = "4px";
    li.appendChild(crown);
  }

  
  if (isNew) {
    const mark = document.createElement("span");
    mark.textContent = "New";
    mark.style.color = "green";
    mark.style.fontSize = "0.8em";
    li.appendChild(mark);
    li.appendChild(document.createElement("br"));
  }

  const btn = document.createElement("button");
  btn.textContent = "📋";
  btn.className = "button";
  btn.addEventListener("click", () => navigator.clipboard.writeText(url));

  const a = document.createElement("a");
  a.textContent = url;
  a.href = url;
  a.target = "_blank";
  a.addEventListener("dblclick", () => window.open(url, "_blank"));

  li.appendChild(btn);
  li.appendChild(a);
  ul.appendChild(li);
}

async function loadLinks() {
  const result = await browser.runtime.sendMessage({ type: "getLinks" });
  const links = result.links || [];
  const wasOpened = result.wasOpenedCount || 0;
  links.forEach((url, idx) => {
    const isNew = idx >= wasOpened;
    addLinkItem(url, isNew);
  });
  browser.browserAction.setBadgeText({ text: '', tabId: (await browser.tabs.query({active:true,currentWindow:true}))[0].id });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id != null) {
      await browser.action.setBadgeText({ text: '', tabId: tab.id });
    }
  } catch (err) {
    console.error("Badge reset error:", err);
  }

  try {
    const result = await browser.runtime.sendMessage({ type: "getLinks" });
    const links = result.links || [];
    const wasOpened = result.wasOpenedCount || 0;
    links.forEach((url, idx) => {
      const isNew = idx >= wasOpened;
      addLinkItem(url, isNew);
    });
  } catch (err) {
    console.error("Loading links failed:", err);
  }
});

