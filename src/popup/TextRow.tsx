import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ClearIcon from '@mui/icons-material/Clear'

import { CardContent, CardActions, Typography } from '@mui/material'
const TextRow: React.FC<{ text: string; onDelete: () => void }> = ({
  text,
  onDelete,
}) => {
  const [open, setOpen] = useState(false)

  const handleHistoryTextClick = async (text: string) => {
    setOpen(true)
    const type = 'text/plain'
    const blob = new Blob([text], { type })
    const data = [new ClipboardItem({ [type]: blob })]
    await navigator.clipboard.write(data)
    setInterval(() => {
      setOpen(false)
    }, 2500)
  }

  return (
    <Box my={'16px'} mb={'10px'}>
      <Card
        variant='outlined'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '40px',
        }}
      >
        <Tooltip
          title={open ? 'copied!' : 'click to copy'}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [-30, -100],
                  },
                },
              ],
            },
          }}
          placement='left'
        >
          <CardContent
            onClick={() => handleHistoryTextClick(text)}
            style={{ cursor: 'pointer' }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography className='album2' variant='body2'>
                {text}
              </Typography>
            </Box>
          </CardContent>
        </Tooltip>

        <CardActions>
          <Tooltip title='Delete'>
            <IconButton onClick={onDelete}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  )
}

export default TextRow
