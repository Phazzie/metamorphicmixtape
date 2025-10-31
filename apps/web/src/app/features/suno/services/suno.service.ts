import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  FormatForSunoRequest,
  FormatForSunoRequestSchema,
  FormatForSunoResponse,
  FormatForSunoResponseSchema
} from '@metamorphic-mixtape/contracts/suno';
import { SunoSeamAdapter } from '../../../core/seams/suno.seam';

@Injectable({ providedIn: 'root' })
export class SunoService {
  constructor(private readonly seam: SunoSeamAdapter) {}

  formatLyrics(request: FormatForSunoRequest): Observable<FormatForSunoResponse> {
    const payload = FormatForSunoRequestSchema.parse(request);
    return this.seam.formatLyrics(payload).pipe(
      map((response) => FormatForSunoResponseSchema.parse(response))
    );
  }
}
