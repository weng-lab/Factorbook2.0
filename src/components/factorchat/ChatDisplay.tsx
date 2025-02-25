'use client'
import { Button, Stack, TextField, Tooltip } from "@mui/material";
import { Refresh, Download, Send } from "@mui/icons-material";
import { MessageComponent } from "./MessageComponent";
import { LoadingMessage } from "./LoadingMessage";
import { useRef, useEffect, SetStateAction } from "react";
import { useFactorChat } from "./useFactorChat";
import { MessageBubble } from "./MessageBubble";
import { MuiMarkdown } from "mui-markdown";
import ConfigureChat from "./ConfigureChat";

type ChatDisplayProps = {
  mode: "window" | "page"
}

export default function ChatDisplay(props: ChatDisplayProps) {
  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    setMessages,
    apiVersion,
    setApiVersion,
    systemPrompt,
    setSystemPrompt,
    loading,
    handleClearMessages,
    handleDownloadMessages
  } = useFactorChat();

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

    const shouldScroll = messages.at(-1)?.role === "user";
    if (shouldScroll) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const initialMessage = 
    `######Hi there!\nI am FactorChat, a tool-augmented LLM that can help you answer questions about transcription factors and navigate FactorBook. It has access to tools to find motifs, binding sites, and RNA expression levels of transcription factors. For questions that I cannot answer using these tools, I will attempt to answer using my general knowledge. Responses are annotated depending on which tool I used to generate the response.`

  return (
    <Stack gap={1} boxSizing={"border-box"} p={1}>
      <ConfigureChat
        apiVersion={apiVersion}
        setApiVersion={setApiVersion}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        handleClearMessages={handleClearMessages}
      />
      <Stack ref={messageRef} gap={2} flexGrow={1} minHeight={"300px"} maxHeight={'700px'} overflow={"auto"}>
        <MessageBubble isUser={false}>
          <MuiMarkdown>
            {initialMessage}
          </MuiMarkdown>
        </MessageBubble>
        {messages.map((message, i) => (
          message.role === "tool_memory" ? null :
            <MessageComponent {...message} key={"message-" + i} />
        ))}
        {loading && <LoadingMessage />}
      </Stack>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 0, gap: '8px' }}>
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
        <Stack direction={"row"} justifyContent={"space-between"}>
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
