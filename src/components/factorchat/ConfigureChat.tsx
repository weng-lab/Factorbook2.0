import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { defaultPrompt1, defaultPrompt2 } from "./helpers";
import { ExpandMore } from "@mui/icons-material";

export interface ConfigureChatProps {
  apiVersion: 1 | 2,
  setApiVersion: Dispatch<SetStateAction<1 | 2>>,
  systemPrompt: string,
  setSystemPrompt: Dispatch<SetStateAction<string>>,
  handleClearMessages: () => void,
}


const ConfigureChat = (props: ConfigureChatProps) => {

  const downloadPrompt = () => {
    const element = document.createElement("a");
    const file = new Blob([props.systemPrompt], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "system_prompt.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApiChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    props.setApiVersion(+value as (1 | 2))
    props.setSystemPrompt(+value === 1 ? defaultPrompt1 : defaultPrompt2)
    props.handleClearMessages()
  }

  return (
    <Stack gap={1}>
      <FormControl>
        <FormLabel>API Version</FormLabel>
        <RadioGroup
          value={props.apiVersion}
          onChange={handleApiChange}
          row
        >
          <FormControlLabel value={1} control={<Radio />} label="1" />
          <FormControlLabel value={2} control={<Radio />} label="2" />
        </RadioGroup>
      </FormControl>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body1">
              System Prompt
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <FormControl fullWidth>
              <FormLabel>System Prompt (changes apply automatically on next message sent)</FormLabel>
              <TextField
                value={props.systemPrompt}
                onChange={(event) => props.setSystemPrompt(event.target.value)}
                multiline
                fullWidth
              />
            </FormControl>
            <Typography>*Changes to this prompt will be reset when reloading or switching API version. Copy/paste or download to save*</Typography>
            <Stack direction={"row"} gap={1}>
              <Button
                variant="outlined"
                onClick={() => props.setSystemPrompt(props.apiVersion === 1 ? defaultPrompt1 : defaultPrompt2)}
              >
                Reset Prompt
              </Button>
              <Button
                variant="outlined"
                onClick={downloadPrompt}
              >
                Download Prompt (.txt)
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </div>
    </Stack>
  )
}

export default ConfigureChat