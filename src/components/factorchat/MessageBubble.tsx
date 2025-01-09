import { Paper, useTheme } from "@mui/material";

interface MessageBubbleProps {
  isUser: boolean;
  children: React.ReactNode;
}

export const MessageBubble = ({ isUser, children }: MessageBubbleProps) => {
  const theme = useTheme()
  
  return (
    <Paper
      sx={{
        p: 1,
        margin: 0.5,
        borderRadius: isUser ? '8px 8px 0px 8px' : '8px 8px 8px 0px',
        maxWidth: '75%',
        alignSelf: isUser ? "flex-end" : "flex-start",
        bgcolor: isUser ? theme.palette.primary.main : '#EEE',
        color: isUser ? theme.palette.primary.contrastText : 'inherit',
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1.5)
      }}
    >
      {children}
    </Paper>
  )
}