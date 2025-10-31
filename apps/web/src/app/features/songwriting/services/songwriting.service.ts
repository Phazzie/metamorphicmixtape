import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import {
  GenerateLyricsRequest,
  GenerateLyricsRequestSchema,
  GenerateLyricsResponse,
  GenerateLyricsResponseSchema
} from '@metamorphic-mixtape/contracts/songwriting';
import { SongwritingSeamAdapter } from '../../../core/seams/songwriting.seam';
import { parseWithContract } from '../../../core/contracts/parse-with-contract';
import { ContractValidationError } from '../../../core/errors/contract-validation.error';
import { SeamRequestError } from '../../../core/errors/seam-request.error';

@Injectable({ providedIn: 'root' })
export class SongwritingService {
  constructor(private readonly seam: SongwritingSeamAdapter) {}

  generateLyrics(request: GenerateLyricsRequest): Observable<GenerateLyricsResponse> {
    const payload = parseWithContract(
      GenerateLyricsRequestSchema,
      request,
      'songwriting.generateLyrics.request'
    );

    return this.seam.generateLyrics(payload).pipe(
      map((response) =>
        parseWithContract(
          GenerateLyricsResponseSchema,
          response,
          'songwriting.generateLyrics.response'
        )
      ),
      catchError((error) => throwError(() => this.handleError('songwriting.generateLyrics', error)))
    );
  }

  private handleError(seam: string, error: unknown): Error {
    if (error instanceof ContractValidationError || error instanceof SeamRequestError) {
      return error;
    }

    return new SeamRequestError(seam, `Unexpected error invoking seam ${seam}`, { cause: error });
  }
}
