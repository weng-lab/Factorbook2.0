'use client'

import { Button, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Refresh, Download, Send } from "@mui/icons-material";
import { FactorChatMessage } from "./types";
import { Message } from "./Message";
import { LoadingMessage } from "./LoadingMessage";
import { useRef, useEffect } from "react";
import { useFactorChat } from "./useFactorChat";
import { MessageBubble } from "./MessageBubble";
import MuiMarkdown from "mui-markdown";

type ChatDisplayProps = {
  mode: "window" | "page"
}

export default function ChatDisplay(props: ChatDisplayProps) {
  const { input, handleInputChange, handleSubmit, messages, setMessages, loading, handleClearMessages, handleDownloadMessages } = useFactorChat();

  const messageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when chat window opened
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Move scroll position along with new messages if scroll close to bottom
  useEffect(() => {
    const container = messageRef.current;
    if (!container) return;

    const shouldScroll = messages.at(-1)?.origin === "user";
    if (shouldScroll) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const initialMessage = 
    `######What is FactorChat?\nFactorchat is a tool-augmented LLM that can help you answer questions about transcription factors and navigate FactorBook. It has access to tools to find motifs, binding sites, and RNA expression levels. For questions it cannot answer using these tools, it will attempt to answer using it's general knowledge. Responses are flagged depending on which approach was taken.`

  return (
    <Stack height="100%">
      <Stack ref={messageRef} gap={2} flexGrow={1} overflow={"auto"}>
        <MessageBubble isUser={false}>
          <MuiMarkdown>
            {initialMessage}
          </MuiMarkdown>
        </MessageBubble>
        {messages.map((message: FactorChatMessage, i) => (
          <Message {...message} key={"message-" + i} />
        ))}
        {loading && <LoadingMessage />}
      </Stack>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 0 }}>
        <TextField
          inputRef={inputRef}
          placeholder={"Ask a question to FactorChat"}
          fullWidth
          multiline
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
        />
        <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
          <Button
            variant="contained"
            type="submit"
            disabled={!input}
            endIcon={<Send />}
            sx={{ textTransform: "none" }}
          >
            Send Message
          </Button>
          <div>
            <Tooltip title="Reset Conversation" placement="top">
              <span>
                <Button onClick={handleClearMessages} disabled={messages.length === 0}>
                  <Refresh />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Download Conversation" placement="top">
              <span>
                <Button onClick={handleDownloadMessages} disabled={messages.length === 0}>
                  <Download />
                </Button>
              </span>
            </Tooltip>
          </div>
        </Stack>
      </form>
    </Stack>
  );
}
