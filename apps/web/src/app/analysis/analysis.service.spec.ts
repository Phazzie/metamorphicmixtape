import { TestBed } from '@angular/core/testing';

import {
  EmotionalArchaeologyInputDto,
  EmotionalArchaeologyOutputDto,
  analysisContracts
} from '@metamorphic-mixtape/contracts';

import { MockToolSeamAdapter } from '../core/seams/tool-seam.mock.js';
import { TOOL_SEAM_ADAPTER } from '../core/seams/tool-seam.adapter.js';
import { AnalysisService } from './analysis.service.js';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let adapter: MockToolSeamAdapter;

  beforeEach(() => {
    adapter = new MockToolSeamAdapter();

    TestBed.configureTestingModule({
      providers: [AnalysisService, { provide: TOOL_SEAM_ADAPTER, useValue: adapter }]
    });

    service = TestBed.inject(AnalysisService);
  });

  it('validates emotional archaeology requests and responses via the shared contract', async () => {
    const input: EmotionalArchaeologyInputDto = {
      data_sources: ['messages', 'search_history'],
      time_period: 'last_3_months',
      emotional_depth: 'deep',
      privacy_level: 'pseudonymous',
      theme_focus: 'Recurring dream sequences'
    };

    const response: EmotionalArchaeologyOutputDto = {
      emotional_patterns: [
        {
          theme: 'Orbiting isolation',
          intensity: 8,
          frequency: 'Weekly spiral',
          context: 'Late-night message drafts',
          song_potential: 'Transform into a pulsing, nocturnal anthem'
        }
      ],
      hidden_themes: [
        {
          theme: 'Synesthetic memories',
          evidence: ['Color-coded notes', 'Searches for neon cities'],
          creative_angle: 'Blend sensory overlaps into lyric metaphors'
        }
      ],
      temporal_patterns: {
        recurring_cycles: ['Monthly creative surges'],
        seasonal_themes: ['Winter introspection'],
        growth_areas: ['Inviting collaborators into the process']
      },
      songwriting_prompts: ['Write from the perspective of the neon city watching you sleep.'],
      creative_insights: ['Your most electric ideas arrive after midnight.']
    };

    adapter.response = response;

    const result = await service.runEmotionalArchaeology(input);

    expect(adapter.calls[0]).toEqual({ contract: analysisContracts.emotionalArchaeology.name, payload: input });
    expect(result).toEqual(response);
  });
});
