import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { GenerateLyricsRequest } from '@metamorphic-mixtape/contracts/songwriting';
import { SEAM_API_BASE_URL } from './seam-tokens';
import { SeamRequestError } from '../errors/seam-request.error';

@Injectable({ providedIn: 'root' })
export class SongwritingSeamAdapter {
  private readonly resource = 'songwriting';

  constructor(private readonly http: HttpClient, @Inject(SEAM_API_BASE_URL) private readonly baseUrl: string) {}

  generateLyrics(request: GenerateLyricsRequest): Observable<unknown> {
    const url = `${this.baseUrl}/${this.resource}/generate-lyrics`;
    return this.http.post(url, request).pipe(
      catchError((error) => throwError(() => SeamRequestError.fromHttpError('songwriting.generateLyrics', error)))
    );
  }
}
