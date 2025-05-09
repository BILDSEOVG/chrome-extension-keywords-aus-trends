document.getElementById("getKeywords").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractTextFromPage
    }, async (injectionResults) => {
      const pageText = injectionResults[0].result;
      const response = await fetch("https://chrome-extension-keywords-aus-trend-viviennes-projects-c1374dbd.vercel.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pageText })
      });
      const keywords = await response.json();
      const list = document.getElementById("keywordList");
      list.innerHTML = "";
      keywords.forEach(k => {
        const li = document.createElement("li");
        li.textContent = k;
        list.appendChild(li);
      });
    });
  });
});

function extractTextFromPage() {
  return document.body.innerText;
}
