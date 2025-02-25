export type Role = "user" | "assistant" | "tool" | "tool_memory"

export type UserMessage = string

export type BackendMessage = {
  text: string
  files: { description: string, url: string }[]
  figures: FactorChatFigure[],
  tool_used?: "RNA_EXPR" | "CHIP_INFO" | "MOTIF_INFO"
  error?: string
}

export type ToolMemory = {
  tool_calls: {
    id: string,
    type: string,
    function: {
      name: string,
      arguments: string
    }
  }[]
}

export type Contents<T extends Role> = T extends "user" ? UserMessage : T extends "tool_memory" ? ToolMemory : BackendMessage

export type Message<T extends Role> = {
  role: T,
  contents: Contents<T>
}

export type BackendResponse = Message<"assistant" | "tool" | "tool_memory">[]

export type Conversation = Message<Role>[]

export type MotifFigureData = {
  ppm: number[][];
  sites?: number;
  e_value?: number;
  original_peaks_occurrences?: number;
  original_peaks?: number;
  flank_occurrences_ratio?: number;
  flank_z_score?: number;
  flank_p_value?: number;
  shuffled_occurrences_ratio?: number;
  shuffled_z_score?: number;
  shuffled_p_value?: number;
}

export type MotifFigure = {
  type: "logo",
  data: MotifFigureData
}

export type FactorChatFigure = (MotifFigure) //Add union type when more supported