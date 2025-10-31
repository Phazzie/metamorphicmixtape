import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  EmotionalArchaeologyRequest,
  EmotionalArchaeologyRequestSchema,
  EmotionalArchaeologyResponse,
  EmotionalArchaeologyResponseSchema
} from '@metamorphic-mixtape/contracts/analysis';
import { AnalysisSeamAdapter } from '../../../core/seams/analysis.seam';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  constructor(private readonly seam: AnalysisSeamAdapter) {}

  runEmotionalArchaeology(request: EmotionalArchaeologyRequest): Observable<EmotionalArchaeologyResponse> {
    const payload = EmotionalArchaeologyRequestSchema.parse(request);
    return this.seam.emotionalArchaeology(payload).pipe(
      map((response) => EmotionalArchaeologyResponseSchema.parse(response))
    );
  }
}
