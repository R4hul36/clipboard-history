export interface LocalStorage {
  clipboardTextList?: string[]
  clipboardTheme?: boolean
}

export type LocalStorageKeys = keyof LocalStorage

export function setStoredText(clipboardTextList: string[]): Promise<void> {
  const values: LocalStorage = {
    clipboardTextList,
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve()
    })
  })
}

export function getStoredText(): Promise<string[]> {
  const storageKeys: LocalStorageKeys[] = ['clipboardTextList']
  return new Promise((resolve) => {
    chrome.storage.local.get(storageKeys, (response) => {
      resolve(response.clipboardTextList)
    })
  })
}

export function setTheme(clipboardTheme: boolean): Promise<void> {
  const values: LocalStorage = {
    clipboardTheme,
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve()
    })
  })
}

export function getTheme(): Promise<boolean> {
  const storageKeys: LocalStorageKeys[] = ['clipboardTheme']
  return new Promise((resolve) => {
    chrome.storage.local.get(storageKeys, (response) => {
      resolve(response.clipboardTheme)
    })
  })
}
