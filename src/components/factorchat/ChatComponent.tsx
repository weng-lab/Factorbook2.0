'use client'

/**
 * This file is currently not being used. Saving in case we need to use it later
 */

import { Chat, Close, CloseFullscreen, CropSquare, DragIndicator, Minimize } from "@mui/icons-material";
import { Box, Button, Divider, Fab, Fade, IconButton, Paper, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import ChatDisplay from "./ChatDisplay";

export default function ChatComponent() {
  const [open, setOpen] = useState(false);
  //This is needed to reset the state of the ChatDisplay component when closing the window
  const [chatKey, setChatKey] = useState(Math.random())
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 600,
    height: 600
  });

  const handleResetPosition = () => {
    setPosition({
      width: 600,
      height: 600,
      x: window.innerWidth - 600 - 15,
      y: window.innerHeight - 600 - 15,
    });
  }

  useEffect(() => {
    handleResetPosition();
    window.addEventListener('resize', handleResetPosition);
    return () => {
      window.removeEventListener('resize', handleResetPosition);
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    //needed to use timeout here since the position was being reset before the transition to closed would happen
    setTimeout(() => {
      handleResetPosition();
      setChatKey(Math.random());
    }, 300);
  };

  const handleMinimize = () => {
    setOpen(false)
    setTimeout(() => {
      handleResetPosition();
    }, 300);
  }

  const handleMaximize = () => {
    setPosition({
      x: 15,
      y: 15,
      width: window.innerWidth - 30,
      height: window.innerHeight - 30
    })
  }

  const theme = useTheme()

  const paperStyle = {
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
    typeof window !== 'undefined' 
    && position.width >= window.innerWidth - 30
    && position.height >= window.innerHeight - 30
    
  const isDefaultPosition =
    typeof window !== 'undefined'
    && position.width === 600
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
          <Paper elevation={5} sx={{ ...paperStyle }}>
            <Stack direction={"row"} ml={0.5} mr={0.5}>
              <Typography variant="h5" display={"flex"} alignItems={"center"} flexGrow={1} className='drag-surface' sx={{ cursor: "move" }} onDoubleClick={isMaximized ? handleResetPosition : handleMaximize}>
                <DragIndicator />
                FactorChat
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
            {/* TODO figure out why overflow="hidden" is necessary. It feels like it shouldn't be */}
            <Box flexGrow={1} overflow={"hidden"}>
              {/* The actual chat */}
              <ChatDisplay key={chatKey} mode="window"/>
            </Box>
          </Paper>
        </Fade>
      </Rnd>
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