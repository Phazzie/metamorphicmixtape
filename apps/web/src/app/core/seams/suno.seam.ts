import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { FormatForSunoRequest } from '@metamorphic-mixtape/contracts/suno';
import { SEAM_API_BASE_URL } from './seam-tokens';
import { SeamRequestError } from '../errors/seam-request.error';

@Injectable({ providedIn: 'root' })
export class SunoSeamAdapter {
  private readonly resource = 'suno';

  constructor(private readonly http: HttpClient, @Inject(SEAM_API_BASE_URL) private readonly baseUrl: string) {}

  formatLyrics(request: FormatForSunoRequest): Observable<unknown> {
    const url = `${this.baseUrl}/${this.resource}/format`;
    return this.http.post(url, request).pipe(
      catchError((error) => throwError(() => SeamRequestError.fromHttpError('suno.formatLyrics', error)))
    );
  }
}
