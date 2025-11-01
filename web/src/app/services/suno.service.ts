import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolApiService } from './tool-api.service';
import { FormatForSunoRequest, FormatForSunoResponse, GenerateSunoTagsRequest, GenerateSunoTagsResponse } from '../models/suno.models';

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
