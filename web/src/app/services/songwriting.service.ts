import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolApiService } from './tool-api.service';
import { GenerateLyricsRequest, GenerateLyricsResponse, RefineLyricsRequest, RefineLyricsResponse } from '../models/songwriting.models';

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
