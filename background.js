chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['paint.js']
    });
  } catch (error) {
    console.error('Error injecting script:', error);
  }
});
