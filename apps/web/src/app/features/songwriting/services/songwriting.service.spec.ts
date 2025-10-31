import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import {
  GenerateLyricsRequest,
  GenerateLyricsRequestSchema,
  GenerateLyricsResponseSchema
} from '@metamorphic-mixtape/contracts/songwriting';
import { SongwritingSeamAdapter } from '../../../core/seams/songwriting.seam';
import { SongwritingService } from './songwriting.service';
import { ContractValidationError } from '../../../core/errors/contract-validation.error';
import { SeamRequestError } from '../../../core/errors/seam-request.error';

describe('SongwritingService', () => {
  let service: SongwritingService;
  let seam: jasmine.SpyObj<SongwritingSeamAdapter>;

  beforeEach(() => {
    const seamSpy = jasmine.createSpyObj<SongwritingSeamAdapter>('SongwritingSeamAdapter', ['generateLyrics']);

    TestBed.configureTestingModule({
      providers: [SongwritingService, { provide: SongwritingSeamAdapter, useValue: seamSpy }]
    });

    service = TestBed.inject(SongwritingService);
    seam = TestBed.inject(SongwritingSeamAdapter) as jasmine.SpyObj<SongwritingSeamAdapter>;
  });

  it('validates requests and parses seam responses using the shared contract', (done) => {
    const request = GenerateLyricsRequestSchema.parse({
      concept: 'A neon-soaked city losing its light',
      tone: 'melancholic',
      style: 'verse-chorus',
      length: 'medium'
    });

    const response = GenerateLyricsResponseSchema.parse({
      lyrics: '[Verse 1] Test lyrics',
      structure: 'V1-C-V2-C',
      creative_notes: 'note',
      emotional_arc: 'arc',
      suggested_refinements: ['Add a bridge']
    });

    seam.generateLyrics.and.returnValue(of(response));

    service.generateLyrics(request).subscribe((result) => {
      expect(result).toEqual(response);
      expect(seam.generateLyrics).toHaveBeenCalledWith(request);
      expect(() => GenerateLyricsResponseSchema.parse(result)).not.toThrow();
      done();
    });
  });

  it('throws a contract validation error when the request violates the contract', () => {
    expect(() => service.generateLyrics({} as GenerateLyricsRequest)).toThrowError(ContractValidationError);
  });

  it('emits a contract validation error when the seam returns an invalid response', (done) => {
    const request = GenerateLyricsRequestSchema.parse({
      concept: 'Concept',
      tone: 'reflective',
      style: 'ballad',
      length: 'short'
    });

    seam.generateLyrics.and.returnValue(of({ invalid: true }));

    service.generateLyrics(request).subscribe({
      next: () => fail('Expected contract validation error'),
      error: (error) => {
        expect(error).toEqual(jasmine.any(ContractValidationError));
        done();
      }
    });
  });

  it('propagates seam request errors', (done) => {
    const request = GenerateLyricsRequestSchema.parse({
      concept: 'Concept',
      tone: 'reflective',
      style: 'ballad',
      length: 'short'
    });

    const seamError = new SeamRequestError('songwriting.generateLyrics', 'Service unavailable', { status: 503 });
    seam.generateLyrics.and.returnValue(throwError(() => seamError));

    service.generateLyrics(request).subscribe({
      next: () => fail('Expected seam error'),
      error: (error) => {
        expect(error).toBe(seamError);
        done();
      }
    });
  });
});
