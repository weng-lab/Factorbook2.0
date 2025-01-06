import { CircularProgress } from "@mui/material"
import { MessageBubble } from "./MessageBubble"

export const LoadingMessage = () => {
  return (
    <MessageBubble isUser={false}>
      <CircularProgress />
    </MessageBubble>
  )
}