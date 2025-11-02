import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolApiService } from './tool-api.service';
import { FormatForSunoRequest, FormatForSunoResponse, GenerateSunoTagsRequest, GenerateSunoTagsResponse } from '../models/suno.models';

/**
 * SunoService - Suno AI Optimization Tools Seam
 * 
 * @seam SunoSeam
 * @contract ../contracts/SunoSeam.contract.v1.yml
 * @version 1
 * 
 * This service implements the SunoSeam contract, providing access to:
 * - format_for_suno: Convert lyrics to Suno-ready format
 * - generate_suno_tags: Generate genre/style tags for Suno
 * 
 * Delegates to ToolApiSeam for HTTP communication.
 * Models match backend contracts in contracts/tool-contracts/src/suno.ts
 * 
 * See contract for: tool specs, inputs, outputs, errors, examples, validation
 */

@Injectable({
  providedIn: 'root'
})
export class SunoService {
  private readonly toolApi = inject(ToolApiService);

  formatForSuno(request: FormatForSunoRequest): Observable<FormatForSunoResponse> {
    return this.toolApi.executeTool<FormatForSunoRequest, FormatForSunoResponse>('format_for_suno', request);
  }

  generateTags(request: GenerateSunoTagsRequest): Observable<GenerateSunoTagsResponse> {
    return this.toolApi.executeTool<GenerateSunoTagsRequest, GenerateSunoTagsResponse>('generate_suno_tags', request);
  }
}
