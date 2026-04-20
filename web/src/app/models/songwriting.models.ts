// Type-safe models matching our Zod contracts in contracts/tool-contracts/src/songwriting.ts

export interface GenerateLyricsRequest {
  concept: string;
  style: 'verse-chorus' | 'narrative' | 'abstract' | 'free-form';
  tone: 'melancholic' | 'uplifting' | 'angry' | 'reflective' | 'playful' | 'dark' | 'hopeful' | 'bittersweet';
  length: 'short' | 'medium' | 'long';
  constraints?: string;
  reference_style?: string;
}

export interface GenerateLyricsResponse {
  lyrics: string;
  structure: string;
  creative_notes: string;
  emotional_arc: string;
  suggested_refinements: string[];
}

export interface RefineLyricsRequest {
  lyrics: string;
  focus_areas: string[];
  intensity: 'light' | 'moderate' | 'aggressive';
  preserve_structure: boolean;
}

export interface RefineLyricsResponse {
  refined_lyrics: string;
  changes_explained: string[];
  improvements: string;
  further_suggestions: string[];
}
