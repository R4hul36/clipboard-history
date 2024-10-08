# Clipboard History

#### Video Demo: https://www.youtube.com/watch?v=yoVKhgXSbY8

#### Description:

This is a chrome extension that allows users to save text from the clipboard. The user can search for specific text using the search bar and each of the text can be removed individually or the saved text can be removed using the 'DELETE ALL' button. There is also a toggle to set "dark" or "light" themes. The user can also export all the saved text in ".txt" format.

### Built With

- JAVASCRIPT
- REACT
- TYPE SCRIPT
- MATERIAL UI

### Installation

1. Install dependencies
   ```sh
   npm install
   ```
2. Creating dist folder
   ```sh
   npm start
   ```
3. Go to chrome://extensions/ and enable Developer mode -> Load unpacked
   and select the "dist" folder

### Usage

The extension automatically saves the text after you copy using either "Ctrl + C" or right click and select copy from the menu. The stored text can then be accessed by clicking the extension icon.

## The main files:

1. Popup.tsx
2. TextRow.tsx
3. contentScript.ts
4. background.ts
5. storage.ts

### 1. Popup.tsx

This react component contains all the visual aspects of the extension. The text info and themes are stored in state along with the functions
"handleSearchFilter", "handleDeleteButtonClick" and "downloadClipboardHistory".

- The "handleSearchFilter" function filters the clipboard list when user enters any text and shows the relevant results.
- The "handleDeleteButtonClick" function removes the text from the list. This is done by using filter method which returns the clipboard list with out the file that has to be removed. The local storage and states are also updated in this function.
- The "downloadClipboardHistory" function allows user to download all the stored text in ".txt" format. This function retrieves the all the text from chrome storage and creates a URL which can be accessed from the extension.

### 2. TextRow.tsx

This component renders each row of text along with a button to remove the said row. The function "handleHistoryTextClick()" is used to display a tooltip labelled "click to copy" when user hover over any text, this changes to "copied" when user click the row.

### 3. contentScript.ts

The contentScript handles all the contents of a webpage. The eventlistner in the script listens for a "copy" action and captures the copied text using the "navigator.clipboard" api. The text and a message is then send to the "background" script.

### 4. background.ts

The background script listens for messages from the content script. When the function receives a message the "getStoredText()" function is called and updates the existing storage with the current copied text by passsing the text to "setStoredText()" function. The function to set the badge text is also handled in background script. The badge shows the number of items in the history. This is done by getting the clipboard history data from the storage and setting the badge text to the length of the array using the "updateBadge()" function.

### 5. storage.ts

The user data is persisted on the extension using the storage. The "LocalStorage" interface stores the copied text and the currrent user theme. The text is stored using the "setStoredText()" function, this function is called when ever user copies a text. The state and the storage is then updated together. The "setTheme" function stores a boolean that is changed when ever the state changes.
