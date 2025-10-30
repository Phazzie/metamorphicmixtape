import { TestBed } from '@angular/core/testing';

import { FormatForSunoInputDto, FormatForSunoOutputDto, sunoContracts } from '@metamorphic-mixtape/contracts';

import { MockToolSeamAdapter } from '../core/seams/tool-seam.mock.js';
import { TOOL_SEAM_ADAPTER } from '../core/seams/tool-seam.adapter.js';
import { SunoService } from './suno.service.js';

describe('SunoService', () => {
  let service: SunoService;
  let adapter: MockToolSeamAdapter;

  beforeEach(() => {
    adapter = new MockToolSeamAdapter();

    TestBed.configureTestingModule({
      providers: [SunoService, { provide: TOOL_SEAM_ADAPTER, useValue: adapter }]
    });

    service = TestBed.inject(SunoService);
  });

  it('calls the format_for_suno seam through the adapter with contract validation', async () => {
    const input: FormatForSunoInputDto = {
      lyrics: 'We chase the aurora down neon corridors',
      style_tags: ['synthwave', 'female vocals'],
      structure_explicit: true,
      optimize_for: 'creativity'
    };

    const response: FormatForSunoOutputDto = {
      formatted_lyrics: '[Verse 1]\nAurora in the fire escape\n',
      structure_markers: ['[Verse 1]', '[Chorus]'],
      formatting_notes: 'Introduced consistent markers and breathing room.',
      suno_best_practices: ['Marked repeating chorus twice', 'Kept line lengths under 90 characters']
    };

    adapter.response = response;

    const result = await service.formatForSuno(input);

    expect(adapter.calls[0]).toEqual({ contract: sunoContracts.formatForSuno.name, payload: input });
    expect(result).toEqual(response);
  });
});
