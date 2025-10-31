import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import {
  EmotionalArchaeologyRequest,
  EmotionalArchaeologyRequestSchema,
  EmotionalArchaeologyResponse,
  EmotionalArchaeologyResponseSchema
} from '@metamorphic-mixtape/contracts/analysis';
import { AnalysisSeamAdapter } from '../../../core/seams/analysis.seam';
import { parseWithContract } from '../../../core/contracts/parse-with-contract';
import { ContractValidationError } from '../../../core/errors/contract-validation.error';
import { SeamRequestError } from '../../../core/errors/seam-request.error';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  constructor(private readonly seam: AnalysisSeamAdapter) {}

  runEmotionalArchaeology(request: EmotionalArchaeologyRequest): Observable<EmotionalArchaeologyResponse> {
    const payload = parseWithContract(
      EmotionalArchaeologyRequestSchema,
      request,
      'analysis.emotionalArchaeology.request'
    );

    return this.seam.emotionalArchaeology(payload).pipe(
      map((response) =>
        parseWithContract(
          EmotionalArchaeologyResponseSchema,
          response,
          'analysis.emotionalArchaeology.response'
        )
      ),
      catchError((error) =>
        throwError(() => this.handleError('analysis.emotionalArchaeology', error))
      )
    );
  }

  private handleError(seam: string, error: unknown): Error {
    if (error instanceof ContractValidationError || error instanceof SeamRequestError) {
      return error;
    }

    return new SeamRequestError(seam, `Unexpected error invoking seam ${seam}`, { cause: error });
  }
}
