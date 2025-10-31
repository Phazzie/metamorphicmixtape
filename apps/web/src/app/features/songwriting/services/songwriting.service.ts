import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  GenerateLyricsRequest,
  GenerateLyricsRequestSchema,
  GenerateLyricsResponse,
  GenerateLyricsResponseSchema
} from '@metamorphic-mixtape/contracts/songwriting';
import { SongwritingSeamAdapter } from '../../../core/seams/songwriting.seam';

@Injectable({ providedIn: 'root' })
export class SongwritingService {
  constructor(private readonly seam: SongwritingSeamAdapter) {}

  generateLyrics(request: GenerateLyricsRequest): Observable<GenerateLyricsResponse> {
    const payload = GenerateLyricsRequestSchema.parse(request);
    return this.seam.generateLyrics(payload).pipe(
      map((response) => GenerateLyricsResponseSchema.parse(response))
    );
  }
}
