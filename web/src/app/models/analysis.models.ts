// Type-safe models matching our Zod contracts

export interface EmotionalArchaeologyRequest {
  text_samples: string[];
  focus_areas: string[];
  depth: 'surface' | 'moderate' | 'deep';
}

export interface EmotionalArchaeologyTheme {
  theme: string;
  description: string;
  evidence: string[];
  song_potential: string;
}

export interface EmotionalArchaeologyResponse {
  extracted_themes: EmotionalArchaeologyTheme[];
  emotional_patterns: string[];
  voice_characteristics: string;
  song_concepts: string[];
}

export interface EvolutionTrackerRequest {
  songs: Array<{
    title: string;
    lyrics: string;
    date_written: string;
  }>;
  focus_dimensions: string[];
}

export interface EvolutionTrackerResponse {
  evolution_summary: string;
  growth_patterns: string[];
  style_shifts: string[];
  recommendations: string[];
}
