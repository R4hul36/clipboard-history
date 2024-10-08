console.log('Content script loaded')

window.addEventListener('copy', async () => {
  try {
    let text = await navigator.clipboard.readText()
    text = text.trim()
    chrome.runtime.sendMessage({ action: 'saveClipboardText', text })
  } catch (err) {
    console.error('Failed to read clipboard contents:', err)
  }
})
