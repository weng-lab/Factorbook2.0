export type FactorChatResponse = {
  text: string
  files: {description: string, url: string}[]
  tool_generated: boolean,
  thoughts: string,
  figures: FactorChatFigure[],
  error?: string
}


export type UserMessage = {
  origin: "user"
  contents: string
}

export type BackendMessage = {
  origin: "backend"
  contents: FactorChatResponse
}

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

export type FactorChatMessage = UserMessage | BackendMessage
