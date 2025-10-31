import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import {
  FormatForSunoRequest,
  FormatForSunoRequestSchema,
  FormatForSunoResponse,
  FormatForSunoResponseSchema
} from '@metamorphic-mixtape/contracts/suno';
import { SunoSeamAdapter } from '../../../core/seams/suno.seam';
import { parseWithContract } from '../../../core/contracts/parse-with-contract';
import { ContractValidationError } from '../../../core/errors/contract-validation.error';
import { SeamRequestError } from '../../../core/errors/seam-request.error';

@Injectable({ providedIn: 'root' })
export class SunoService {
  constructor(private readonly seam: SunoSeamAdapter) {}

  formatLyrics(request: FormatForSunoRequest): Observable<FormatForSunoResponse> {
    const payload = parseWithContract(
      FormatForSunoRequestSchema,
      request,
      'suno.formatLyrics.request'
    );

    return this.seam.formatLyrics(payload).pipe(
      map((response) =>
        parseWithContract(FormatForSunoResponseSchema, response, 'suno.formatLyrics.response')
      ),
      catchError((error) => throwError(() => this.handleError('suno.formatLyrics', error)))
    );
  }

  private handleError(seam: string, error: unknown): Error {
    if (error instanceof ContractValidationError || error instanceof SeamRequestError) {
      return error;
    }

    return new SeamRequestError(seam, `Unexpected error invoking seam ${seam}`, { cause: error });
  }
}
