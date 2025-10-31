import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import {
  FormatForSunoRequest,
  FormatForSunoRequestSchema,
  FormatForSunoResponseSchema
} from '@metamorphic-mixtape/contracts/suno';
import { SunoSeamAdapter } from '../../../core/seams/suno.seam';
import { SunoService } from './suno.service';
import { ContractValidationError } from '../../../core/errors/contract-validation.error';
import { SeamRequestError } from '../../../core/errors/seam-request.error';

describe('SunoService', () => {
  let service: SunoService;
  let seam: jasmine.SpyObj<SunoSeamAdapter>;

  beforeEach(() => {
    const seamSpy = jasmine.createSpyObj<SunoSeamAdapter>('SunoSeamAdapter', ['formatLyrics']);

    TestBed.configureTestingModule({
      providers: [SunoService, { provide: SunoSeamAdapter, useValue: seamSpy }]
    });

    service = TestBed.inject(SunoService);
    seam = TestBed.inject(SunoSeamAdapter) as jasmine.SpyObj<SunoSeamAdapter>;
  });

  it('wraps seam calls with shared contract validation', (done) => {
    const request = FormatForSunoRequestSchema.parse({
      lyrics: 'Example lyrics',
      structure_explicit: true,
      optimize_for: 'balanced'
    });

    const response = FormatForSunoResponseSchema.parse({
      formatted_lyrics: '[Verse 1] Example',
      structure_markers: ['[Verse 1]', '[Chorus]'],
      formatting_notes: 'notes',
      suno_best_practices: ['Mark repeated sections clearly.']
    });

    seam.formatLyrics.and.returnValue(of(response));

    service.formatLyrics(request).subscribe((result) => {
      expect(result).toEqual(response);
      expect(seam.formatLyrics).toHaveBeenCalledWith(request);
      expect(() => FormatForSunoResponseSchema.parse(result)).not.toThrow();
      done();
    });
  });

  it('rejects invalid requests before contacting the seam', () => {
    expect(() => service.formatLyrics({} as FormatForSunoRequest)).toThrowError(ContractValidationError);
  });

  it('emits contract validation errors for malformed seam responses', (done) => {
    const request = FormatForSunoRequestSchema.parse({
      lyrics: 'Example lyrics',
      structure_explicit: true,
      optimize_for: 'balanced'
    });

    seam.formatLyrics.and.returnValue(of({ incorrect: true }));

    service.formatLyrics(request).subscribe({
      next: () => fail('Expected contract validation error'),
      error: (error) => {
        expect(error).toEqual(jasmine.any(ContractValidationError));
        done();
      }
    });
  });

  it('propagates seam request errors for caller handling', (done) => {
    const request = FormatForSunoRequestSchema.parse({
      lyrics: 'Example lyrics',
      structure_explicit: true,
      optimize_for: 'balanced'
    });

    const seamError = new SeamRequestError('suno.formatLyrics', 'Bad gateway', { status: 502 });
    seam.formatLyrics.and.returnValue(throwError(() => seamError));

    service.formatLyrics(request).subscribe({
      next: () => fail('Expected seam error'),
      error: (error) => {
        expect(error).toBe(seamError);
        done();
      }
    });
  });
});
