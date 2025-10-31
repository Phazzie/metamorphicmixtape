import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import {
  EmotionalArchaeologyRequestSchema,
  EmotionalArchaeologyResponseSchema
} from '@metamorphic-mixtape/contracts/analysis';
import { AnalysisSeamAdapter } from '../../../core/seams/analysis.seam';
import { AnalysisService } from './analysis.service';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let seam: jasmine.SpyObj<AnalysisSeamAdapter>;

  beforeEach(() => {
    const seamSpy = jasmine.createSpyObj<AnalysisSeamAdapter>('AnalysisSeamAdapter', ['emotionalArchaeology']);

    TestBed.configureTestingModule({
      providers: [AnalysisService, { provide: AnalysisSeamAdapter, useValue: seamSpy }]
    });

    service = TestBed.inject(AnalysisService);
    seam = TestBed.inject(AnalysisSeamAdapter) as jasmine.SpyObj<AnalysisSeamAdapter>;
  });

  it('enforces contract validation around the emotional archaeology seam', (done) => {
    const request = EmotionalArchaeologyRequestSchema.parse({
      data_sources: ['messages', 'emails'],
      time_period: 'last_month',
      emotional_depth: 'moderate',
      privacy_level: 'anonymous'
    });

    const response = EmotionalArchaeologyResponseSchema.parse({
      emotional_patterns: [
        {
          theme: 'City nostalgia',
          intensity: 7,
          frequency: 'Weekly',
          context: 'Late night message threads',
          song_potential: 'High due to vivid imagery'
        }
      ],
      hidden_themes: [
        {
          theme: 'Unresolved departures',
          evidence: ['Archived chats'],
          creative_angle: 'Use contrasting time signatures'
        }
      ],
      temporal_patterns: {
        recurring_cycles: ['Friday nostalgia'],
        seasonal_themes: ['Winter introspection'],
        growth_areas: ['Assertive communication']
      },
      songwriting_prompts: ['Write from the perspective of the city lights.'],
      creative_insights: ['Experiment with counterpoint melodies.']
    });

    seam.emotionalArchaeology.and.returnValue(of(response));

    service.runEmotionalArchaeology(request).subscribe((result) => {
      expect(result).toEqual(response);
      expect(seam.emotionalArchaeology).toHaveBeenCalledWith(request);
      expect(() => EmotionalArchaeologyResponseSchema.parse(result)).not.toThrow();
      done();
    });
  });
});
