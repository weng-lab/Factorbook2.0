import { BackendResponse } from './types'

export const exampleResponse: BackendResponse = [
  {
    "role": "assistant",
    "contents": {
      "figures": [],
      "files": [],
      "text": "I'll help you get AP-1's binding motif logo across all sample types using the MOTIF_INFO tool.\n\n[[MOTIF_INFO(\"AP-1\", \"all\")]]\n\nThis motif logo represents the DNA sequence preference of AP-1, where the height of each letter indicates how frequently that nucleotide appears at that position in the binding site. The classic AP-1 binding motif is typically characterized by the TGA(C/G)TCA sequence, which should be reflected in this logo.\n\nWould you like me to explain any specific aspects of this motif logo or would you like to see how it might vary in specific cell types?"
    }
  },
  {
    "role": "tool",
    "contents": {
      "figures": [],
      "files": [],
      "text": "There are no matches for all in our database.",
      "tool_used": "MOTIF_INFO"
    }
  }
]