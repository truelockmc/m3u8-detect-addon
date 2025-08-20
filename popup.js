// popup.js

const ul = document.getElementById("linkList");

// Funktion zum Hinzufügen eines Links zum UI
function addLinkItem(url) {
  const li = document.createElement("li");

  // Clipboard-Button
  const btn = document.createElement("button");
  btn.textContent = "📋";
  btn.className = "button";
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(url);
  });

  // Link
  const a = document.createElement("a");
  a.textContent = url;
  a.href = url;
  a.target = "_blank";
  a.addEventListener("dblclick", () => window.open(url, "_blank"));

  // Hinzufügen der Elemente zum Listenelement
  li.appendChild(btn);
  li.appendChild(a);
  ul.appendChild(li);
}

// Funktion zum Laden der Links
async function loadLinks() {
  const result = await browser.runtime.sendMessage({ type: "getLinks" });
  const links = result.links || [];
  links.forEach(addLinkItem);
}

// Listener für neue Links
browser.runtime.onMessage.addListener(msg => {
  if (msg.type === "newLink") {
    addLinkItem(msg.url);
  }
});

// Beim Laden des Popups Links anzeigen
document.addEventListener("DOMContentLoaded", loadLinks);
