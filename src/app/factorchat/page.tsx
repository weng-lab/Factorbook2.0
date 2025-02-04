'use client'

import ChatDisplay from "@/components/factorchat/ChatDisplay"
import { Box, Divider, Stack, Typography } from "@mui/material"
import { useRouter } from "next/navigation"

export default function FactorChat() {
  const router = useRouter()

  if (process.env.enableFactorChat !== 'true') {
    router.replace('/')
  }

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