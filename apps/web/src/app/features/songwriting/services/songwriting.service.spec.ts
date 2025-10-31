import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import {
  GenerateLyricsRequestSchema,
  GenerateLyricsResponseSchema
} from '@metamorphic-mixtape/contracts/songwriting';
import { SongwritingSeamAdapter } from '../../../core/seams/songwriting.seam';
import { SongwritingService } from './songwriting.service';

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
});
