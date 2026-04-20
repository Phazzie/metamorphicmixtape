// Type-safe models matching our Zod contracts

export interface FormatForSunoRequest {
  lyrics: string;
  optimization_level: 'minimal' | 'balanced' | 'aggressive';
}

export interface FormatForSunoResponse {
  formatted_lyrics: string;
  changes_made: string[];
  suno_tips: string[];
}

export interface GenerateSunoTagsRequest {
  lyrics: string;
  desired_style: string;
  reference_songs?: string[];
}

export interface GenerateSunoTagsResponse {
  primary_tags: string[];
  secondary_tags: string[];
  tag_explanation: string;
  alternatives: string[];
  usage_tips: string;
}
