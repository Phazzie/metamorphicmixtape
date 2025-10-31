import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { EmotionalArchaeologyRequest } from '@metamorphic-mixtape/contracts/analysis';
import { SEAM_API_BASE_URL } from './seam-tokens';
import { SeamRequestError } from '../errors/seam-request.error';

@Injectable({ providedIn: 'root' })
export class AnalysisSeamAdapter {
  private readonly resource = 'analysis';

  constructor(private readonly http: HttpClient, @Inject(SEAM_API_BASE_URL) private readonly baseUrl: string) {}

  emotionalArchaeology(request: EmotionalArchaeologyRequest): Observable<unknown> {
    const url = `${this.baseUrl}/${this.resource}/emotional-archaeology`;
    return this.http.post(url, request).pipe(
      catchError((error) => throwError(() => SeamRequestError.fromHttpError('analysis.emotionalArchaeology', error)))
    );
  }
}
