import { Inject, Injectable } from '@angular/core';
import {
  EmotionalArchaeologyInputDto,
  EmotionalArchaeologyOutputDto,
  analysisContracts,
  emotionalArchaeologyInputSchema,
  emotionalArchaeologyOutputSchema
} from '@metamorphic-mixtape/contracts';

import { TOOL_SEAM_ADAPTER, ToolSeamAdapter } from '../core/seams/tool-seam.adapter.js';

@Injectable()
export class AnalysisService {
  private readonly contract = analysisContracts.emotionalArchaeology;

  constructor(@Inject(TOOL_SEAM_ADAPTER) private readonly adapter: ToolSeamAdapter) {}

  async runEmotionalArchaeology(
    input: EmotionalArchaeologyInputDto
  ): Promise<EmotionalArchaeologyOutputDto> {
    const validatedInput = emotionalArchaeologyInputSchema.parse(input);
    const rawResponse = await this.adapter.invoke<typeof validatedInput, unknown>(
      this.contract.name,
      validatedInput
    );
    return emotionalArchaeologyOutputSchema.parse(rawResponse);
  }
}
