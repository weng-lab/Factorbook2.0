export interface MemeOccurrence {
    id: string;
    region: string;
    count: number;
  }
  
  export interface SearchMemeOccuByRegionQueryResponse {
    meme_occurrences: MemeOccurrence[];
  }
  