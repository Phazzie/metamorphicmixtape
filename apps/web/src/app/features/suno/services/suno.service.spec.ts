import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FormatForSunoRequestSchema, FormatForSunoResponseSchema } from '@metamorphic-mixtape/contracts/suno';
import { SunoSeamAdapter } from '../../../core/seams/suno.seam';
import { SunoService } from './suno.service';

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
});
