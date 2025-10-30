import { Inject, Injectable } from '@angular/core';
import {
  GenerateLyricsInputDto,
  GenerateLyricsOutputDto,
  generateLyricsInputSchema,
  generateLyricsOutputSchema,
  songwritingContracts
} from '@metamorphic-mixtape/contracts';

import { TOOL_SEAM_ADAPTER, ToolSeamAdapter } from '../core/seams/tool-seam.adapter.js';

@Injectable()
export class SongwritingService {
  private readonly contract = songwritingContracts.generateLyrics;

  constructor(@Inject(TOOL_SEAM_ADAPTER) private readonly adapter: ToolSeamAdapter) {}

  async generateLyrics(input: GenerateLyricsInputDto): Promise<GenerateLyricsOutputDto> {
    const validatedInput = generateLyricsInputSchema.parse(input);
    const rawResponse = await this.adapter.invoke<typeof validatedInput, unknown>(
      this.contract.name,
      validatedInput
    );
    return generateLyricsOutputSchema.parse(rawResponse);
  }
}
