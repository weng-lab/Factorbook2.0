'use client'

import ChatDisplay from "@/components/factorchat/ChatDisplay"
import { Box, Divider, Stack, Typography } from "@mui/material"

export default function FactorChat() {
  return (
    <Stack height={'80vh'} maxWidth={'900px'} m={'auto'} p={4} gap={1}>
      <Typography variant="h4" alignSelf={"center"}>FactorChat</Typography>
      <Divider />
      <Box height={"100%"} overflow={"hidden"}>
        <ChatDisplay mode="page" />
      </Box>
    </Stack>
  )
}