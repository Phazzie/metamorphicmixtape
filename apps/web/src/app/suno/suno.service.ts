import { Inject, Injectable } from '@angular/core';
import {
  FormatForSunoInputDto,
  FormatForSunoOutputDto,
  formatForSunoInputSchema,
  formatForSunoOutputSchema,
  sunoContracts
} from '@metamorphic-mixtape/contracts';

import { TOOL_SEAM_ADAPTER, ToolSeamAdapter } from '../core/seams/tool-seam.adapter.js';

@Injectable()
export class SunoService {
  private readonly contract = sunoContracts.formatForSuno;

  constructor(@Inject(TOOL_SEAM_ADAPTER) private readonly adapter: ToolSeamAdapter) {}

  async formatForSuno(input: FormatForSunoInputDto): Promise<FormatForSunoOutputDto> {
    const validatedInput = formatForSunoInputSchema.parse(input);
    const rawResponse = await this.adapter.invoke<typeof validatedInput, unknown>(
      this.contract.name,
      validatedInput
    );
    return formatForSunoOutputSchema.parse(rawResponse);
  }
}
