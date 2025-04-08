document.getElementById("filterBtn").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: filterEcoFriendly
      });
    });
  });
  
  function filterEcoFriendly() {
    window.dispatchEvent(new CustomEvent("r3vision-filter"));
  }
  