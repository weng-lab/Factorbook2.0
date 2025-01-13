'use client'
import { Chat, Close, CloseFullscreen, CropSquare, Download, DragIndicator, InfoOutlined, Minimize, Refresh, Send } from "@mui/icons-material";
import { Box, Button, Divider, Fab, Fade, IconButton, Paper, Stack, SxProps, TextField, Theme, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { useFactorChat } from "./useFactorChat";
import { FactorChatMessage } from "./types";
import { Message } from "./Message";
import { LoadingMessage } from "./LoadingMessage";

export default function ChatComponenet() {
  const { input, handleInputChange, handleSubmit, messages, setMessages, loading } = useFactorChat();
  const [open, setOpen] = useState(false);
  // Start with null or consistent initial position to 
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 600,
    height: 600
  });

  // Sets position/size to default bottom left corner
  const handleResetPosition = () => {
    setPosition({
      width: 600,
      height: 600,
      x: window.innerWidth - 600 - 15,
      y: window.innerHeight - 600 - 15,
    });
  }

  // Calculate position after initial render
  useEffect(() => {
    // Run on initial render
    handleResetPosition();

    // Add event listener for window resize
    window.addEventListener('resize', handleResetPosition);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResetPosition);
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  }

  // Minimize window, reset position, and clear messages
  const handleClose = () => {
    setOpen(false);
    //needed to use timeout here since the position was being reset before the transition to closed would happen
    setTimeout(() => {
      handleResetPosition();
      setMessages([]);
    }, 300);
  };

  // Minimize chat window and reset position
  const handleMinimize = () => {
    setOpen(false)
    setTimeout(() => {
      handleResetPosition();
    }, 300);
  }

  // Maximize window, set position to fill screen
  const handleMaximize = () => {
    setPosition({
      x: 15,
      y: 15,
      width: window.innerWidth - 30,
      height: window.innerHeight - 30
  })
  }

  const messageRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  //Focus input when chat window opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  //Move scroll position along with new messages if scroll close to bottom
  useEffect(() => {
    const container = messageRef.current
    if (!container) return;
    
    const shouldScroll = messages.at(-1)?.origin === "user"
    if (shouldScroll) container.scrollTop = container.scrollHeight;
  }, [messages])

  const handleClearMessages = () => {
    setMessages([])
  }

  //this is giving security warnings
  const handleDownloadMessages = () => {
    const element = document.createElement("a");
    const jsonData = JSON.stringify({ messages }, null, 2);
    const file = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    element.download = `messages_${timestamp}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const theme = useTheme()

  const paperStyle: SxProps<Theme> = {
    boxSizing: "border-box",
    width: '100%',
    height: '100%',
    paddingX: theme.spacing(1.5),
    paddingY: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  };

  const handleDrag: RndDragCallback = (e, d) => {
    setPosition({ ...position, x: d.x, y: d.y})
  }

  const handleResize: RndResizeCallback = (e, direction, ref, delta, position) => {
    setPosition({ width: ref.offsetWidth, height: ref.offsetHeight, ...position })
  }

  const isMaximized =
    position.width >= window.innerWidth - 30
    && position.height >= window.innerHeight - 30
    
  const isDefaultPosition =
    position.width === 600
    && position.height === 600
    && position.x === window.innerWidth - 600 - 15
    && position.y === window.innerHeight - 600 - 15

  return (
    <Box height={'100vh'} zIndex={1500} width={'100vw'} position={"fixed"} top={0} left={0} sx={{ pointerEvents: 'none' }}>
      {/* Chat window */}
      <Rnd
        dragHandleClassName="drag-surface"
        position={{ x: position.x, y: position.y }}
        size={{ width: position.width, height: position.height }}
        onDrag={handleDrag}
        onResize={handleResize}
        minHeight={500}
        minWidth={500}
        style={{ display: 'flex', flexDirection: 'column', pointerEvents: open ? 'auto' : 'none' }}
        bounds={"window"}
      >
        {/* Fade does not work when parent of Rnd, so setting pointerEvents to none on Rnd when not open */}
        <Fade in={open}>
          <Paper elevation={5}  sx={{ ...paperStyle }} >
            {/* <Stack> */}
            <Stack direction={"row"} ml={0.5} mr={0.5}>
              <Typography variant="h5" display={"flex"} alignItems={"center"} flexGrow={1} className='drag-surface' sx={{ cursor: "move" }} onDoubleClick={isMaximized ? handleResetPosition : handleMaximize}>
                <DragIndicator />
                FactorChat
                {/* <Tooltip title="Here is some information on how FactorChat works" placement="top">
                  <InfoOutlined sx={{ ml: 0.5 }} fontSize="small" />
                </Tooltip> */}
              </Typography>
              <Tooltip title="Minimize" placement="bottom" enterDelay={2000}>
                <IconButton onClick={handleMinimize}>
                  <Minimize />
                </IconButton>
              </Tooltip>
              {isMaximized ?
                <Tooltip title="Reset Position" placement="bottom" enterDelay={2000}>
                  <IconButton onClick={handleResetPosition}>
                    <CloseFullscreen />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title="Maximize" placement="bottom" enterDelay={2000}>
                  <IconButton onClick={handleMaximize}>
                    <CropSquare />
                  </IconButton>
                </Tooltip>
              }
              <Tooltip title="Close" placement="bottom" enterDelay={2000}>
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Stack>
            <Divider />
            {/* The Chat */}
            <Stack ref={messageRef} gap={2} flexGrow={1} overflow={"auto"}>
              {messages.map((message: FactorChatMessage, i) => {
                return (
                  <Message {...message} key={"message-" + i} />
                )
              })}
              {loading && <LoadingMessage />}
            </Stack>
            {/* The Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                marginLeft: theme.spacing(0.5),
                marginRight: theme.spacing(0.5),
              }}
            >
              <TextField
                inputRef={inputRef}
                placeholder={"Ask a question to FactorChat"}
                fullWidth
                multiline
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSubmit(e)
                  }
                }}
              />
              <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
                <Button variant="contained" type="submit" disabled={!input} endIcon={<Send />} sx={{ textTransform: "none" }}>
                  Send Message
                </Button>
                <div>
                  <Tooltip title="Reset Conversation" placement="top">
                    {/* span necessary since Tooltip needs to listen to child's events and disabled buttons do not fire events */}
                    <span>
                      <IconButton onClick={handleClearMessages} disabled={messages.length === 0}>
                        <Refresh />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Download Conversation" placement="top">
                    <span>
                      <IconButton onClick={handleDownloadMessages} disabled={messages.length === 0}>
                        <Download />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </Stack>
            </form>
          </Paper>
        </Fade>
      </Rnd>
      {/* Icon to open chat */}
      <Fade in={!open}>
        <Tooltip title="Ask FactorChat" placement="left">
          <Fab
            color="primary"
            aria-label="open modal"
            onClick={handleOpen}
            size="medium"
            sx={{
              pointerEvents: 'auto',
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <Chat />
          </Fab>
        </Tooltip>
      </Fade>
    </Box>
  )
}