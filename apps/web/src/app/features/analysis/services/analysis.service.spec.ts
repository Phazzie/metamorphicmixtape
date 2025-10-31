import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import {
  EmotionalArchaeologyRequest,
  EmotionalArchaeologyRequestSchema,
  EmotionalArchaeologyResponseSchema
} from '@metamorphic-mixtape/contracts/analysis';
import { AnalysisSeamAdapter } from '../../../core/seams/analysis.seam';
import { AnalysisService } from './analysis.service';
import { ContractValidationError } from '../../../core/errors/contract-validation.error';
import { SeamRequestError } from '../../../core/errors/seam-request.error';

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

  it('throws a contract validation error for invalid requests', () => {
    expect(() => service.runEmotionalArchaeology({} as EmotionalArchaeologyRequest)).toThrowError(
      ContractValidationError
    );
  });

  it('surfaces contract validation failures for invalid responses', (done) => {
    const request = EmotionalArchaeologyRequestSchema.parse({
      data_sources: ['messages'],
      time_period: 'last_month',
      emotional_depth: 'deep',
      privacy_level: 'anonymous'
    });

    seam.emotionalArchaeology.and.returnValue(of({ invalid: true }));

    service.runEmotionalArchaeology(request).subscribe({
      next: () => fail('Expected contract validation error'),
      error: (error) => {
        expect(error).toEqual(jasmine.any(ContractValidationError));
        done();
      }
    });
  });

  it('propagates seam request errors without modification', (done) => {
    const request = EmotionalArchaeologyRequestSchema.parse({
      data_sources: ['messages'],
      time_period: 'last_month',
      emotional_depth: 'deep',
      privacy_level: 'anonymous'
    });

    const seamError = new SeamRequestError('analysis.emotionalArchaeology', 'Gateway timeout', { status: 504 });
    seam.emotionalArchaeology.and.returnValue(throwError(() => seamError));

    service.runEmotionalArchaeology(request).subscribe({
      next: () => fail('Expected seam error'),
      error: (error) => {
        expect(error).toBe(seamError);
        done();
      }
    });
  });
});
