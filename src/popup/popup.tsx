import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import TextRow from './TextRow'
import './popup.css'
import {
  getStoredText,
  setStoredText,
  getTheme,
  setTheme,
} from '../utils/storage'
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import Tooltip from '@mui/material/Tooltip'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Button, Paper, InputBase, Box, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

const App: React.FC<{}> = () => {
  const [clipboardText, setClipboardText] = useState<string[]>([])
  const [inputText, setInputText] = useState<string>('')
  const [mode, setMode] = useState(false)

  // Fetch clipboard history when the popup loads
  useEffect(() => {
    getStoredText().then((storedText) => {
      setClipboardText(storedText || [])
      chrome.action.setBadgeText({
        text: storedText.length.toString(),
      })
    })
    getTheme().then((storedTheme) => {
      setMode(storedTheme)
    })
  }, [])

  // Material ui theme setup for dark mode
  const popupTheme = createTheme({
    palette: {
      mode: mode ? 'dark' : 'light',
    },
  })

  // function to toggle theme
  const handleTheme = () => {
    // ;() => (mode ? setMode(false) : setMode(true))

    if (mode) {
      setMode(false)
      setTheme(false)
    } else {
      setMode(true)
      setTheme(true)
    }
  }

  // Function to delete an item, which also works when using search
  const handleDeleteButtonClick = (index: number) => {
    let filteredHistory = handleSearchFilter()
    let updatedClipboard: string[] = clipboardText.filter(
      (_, i) => clipboardText[i] !== filteredHistory[index]
    )

    // Update state and storage after deletion
    setClipboardText(updatedClipboard)
    setStoredText(updatedClipboard)
    chrome.action.setBadgeText({
      text: updatedClipboard.length.toString(),
    })
  }

  // Function that filters using the text enetered in the search bar
  const handleSearchFilter = (): string[] => {
    if (!inputText) {
      return clipboardText
    }
    let filteredHistory = clipboardText.filter((text) =>
      text.toLowerCase().includes(inputText.toLowerCase())
    )
    return filteredHistory
  }

  // Function allows users to download the history in ".txt" format
  const downloadClipboardHistory = () => {
    getStoredText().then((storedText) => {
      if (storedText && storedText.length) {
        const fileContent = storedText
          .map((text, index) => {
            return `Entry #${index + 1}\nText: ${text}\n---\n`
          })
          .join('\n')
        const blob = new Blob([fileContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'clipboard_history.txt'
        document.body.appendChild(a)
        a.click()

        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    })
  }

  return (
    <ThemeProvider theme={popupTheme}>
      <CssBaseline />
      <>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            mb: '15px',
          }}
        >
          <img
            style={{
              width: '25px',
              height: '25px',
            }}
            src='icon.png'
            alt=''
          />
          <Typography variant='h6'>Clipboard History</Typography>

          <Box sx={{ ml: '230px' }}>
            <Tooltip title={'Export'}>
              <Button
                startIcon={<FileDownloadIcon />}
                sx={{
                  color: `${mode ? 'white' : 'black'} `,
                  mb: '8px',
                  minWidth: '0px',
                  backgroundColor: 'transparent',
                }}
                onClick={downloadClipboardHistory}
              ></Button>
            </Tooltip>

            <DarkModeSwitch
              // style={{ marginLeft: '300px' }}
              checked={mode}
              onChange={handleTheme}
              size={18}
              style={{ marginLeft: '20px' }}
            />
          </Box>
        </Box>

        <Box style={{ display: 'flex', gap: '12px' }} mb={'20px'}>
          <Paper
            component='form'
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 360,
            }}
          >
            <InputBase
              type='search'
              data-clear-btn='true'
              onChange={(e) => setInputText(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
              placeholder='Search history'
              inputProps={{ 'aria-label': 'search history' }}
            />
          </Paper>

          <Button
            color='error'
            variant='outlined'
            startIcon={<DeleteIcon />}
            onClick={() => {
              chrome.action.setBadgeText({
                text: '0',
              })
              setClipboardText([])
              setStoredText([])
            }}
          >
            Delete All
          </Button>
        </Box>
        {clipboardText.length === 0 ? ( // Check if clipboard history is empty
          <p>No clipboard history available.</p>
        ) : handleSearchFilter().length === 0 ? (
          <p>Cannot find "{inputText}"</p>
        ) : (
          handleSearchFilter().map((text, index) => (
            <TextRow
              key={index}
              text={text}
              onDelete={() => handleDeleteButtonClick(index)}
            />
          ))
        )}
      </>
    </ThemeProvider>
  )
}
const container = document.createElement('div')
container.id = 'app'
document.body.appendChild(container)
const appContainer = document.getElementById('app')
const root = createRoot(appContainer!)
root.render(<App />)
