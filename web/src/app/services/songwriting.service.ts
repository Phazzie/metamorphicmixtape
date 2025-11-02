import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolApiService } from './tool-api.service';
import { GenerateLyricsRequest, GenerateLyricsResponse, RefineLyricsRequest, RefineLyricsResponse } from '../models/songwriting.models';

/**
 * SongwritingService - Songwriting Tools Seam
 * 
 * @seam SongwritingSeam
 * @contract ../contracts/SongwritingSeam.contract.v1.yml
 * @version 1
 * 
 * This service implements the SongwritingSeam contract, providing access to:
 * - generate_lyrics: Generate original lyrics from concepts
 * - refine_lyrics: Improve and optimize existing lyrics
 * 
 * Delegates to ToolApiSeam for HTTP communication.
 * Models match backend contracts in contracts/tool-contracts/src/songwriting.ts
 * 
 * See contract for: tool specs, inputs, outputs, errors, examples, validation
 */

@Injectable({
  providedIn: 'root'
})
export class SongwritingService {
  private readonly toolApi = inject(ToolApiService);

  generateLyrics(request: GenerateLyricsRequest): Observable<GenerateLyricsResponse> {
    return this.toolApi.executeTool<GenerateLyricsRequest, GenerateLyricsResponse>('generate_lyrics', request);
  }

  refineLyrics(request: RefineLyricsRequest): Observable<RefineLyricsResponse> {
    return this.toolApi.executeTool<RefineLyricsRequest, RefineLyricsResponse>('refine_lyrics', request);
  }
}
