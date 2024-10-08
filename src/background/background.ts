import { getStoredText, setStoredText } from '../utils/storage'

chrome.runtime.onInstalled.addListener(() => {
  updateBadge()
})

chrome.runtime.onStartup.addListener(() => {
  updateBadge()
})

function updateBadge() {
  getStoredText().then((storedText) => {
    if (storedText) {
      chrome.action.setBadgeText({ text: storedText.length.toString() })
    }
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveClipboardText') {
    const text = message.text

    getStoredText().then((clipboardTextList) => {
      let clipboardHistory = clipboardTextList || []

      // The text is not added if it's already present in the history
      if (text && !clipboardHistory.includes(text)) {
        clipboardHistory = [text, ...clipboardHistory]
        // Store updated clipboard history in chrome storage
        setStoredText(clipboardHistory)
        updateBadge()
      }
    })
    return true
  }
})
