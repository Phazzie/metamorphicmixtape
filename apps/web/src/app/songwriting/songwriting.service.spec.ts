import { TestBed } from '@angular/core/testing';

import {
  GenerateLyricsInputDto,
  GenerateLyricsOutputDto,
  songwritingContracts
} from '@metamorphic-mixtape/contracts';

import { MockToolSeamAdapter } from '../core/seams/tool-seam.mock.js';
import { TOOL_SEAM_ADAPTER } from '../core/seams/tool-seam.adapter.js';
import { SongwritingService } from './songwriting.service.js';

describe('SongwritingService', () => {
  let service: SongwritingService;
  let adapter: MockToolSeamAdapter;

  beforeEach(() => {
    adapter = new MockToolSeamAdapter();

    TestBed.configureTestingModule({
      providers: [SongwritingService, { provide: TOOL_SEAM_ADAPTER, useValue: adapter }]
    });

    service = TestBed.inject(SongwritingService);
  });

  it('invokes the generate lyrics seam with contract-compliant payloads', async () => {
    const input: GenerateLyricsInputDto = {
      concept: 'A lighthouse teaching the city how to hope again',
      style: 'verse-chorus',
      tone: 'hopeful',
      length: 'medium',
      constraints: 'Include ocean imagery'
    };

    const response: GenerateLyricsOutputDto = {
      lyrics: '[Verse 1]\nWe stitch the harbor lights...\n',
      structure: 'V1-C-V2-C-B-C',
      creative_notes: 'Anchored metaphors around illumination and resilience.',
      emotional_arc: 'Begins in darkness, crescendos into communal hope.',
      suggested_refinements: ['Layer in a tactile sensory detail for the chorus']
    };

    adapter.response = response;

    const result = await service.generateLyrics(input);

    expect(adapter.calls.length).toBe(1);
    expect(adapter.calls[0]).toEqual({ contract: songwritingContracts.generateLyrics.name, payload: input });
    expect(result).toEqual(response);
  });
});
