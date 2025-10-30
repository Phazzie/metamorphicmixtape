import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TOOL_SEAM_BASE_URL, ToolSeamAdapter } from './tool-seam.adapter.js';

@Injectable()
export class HttpToolSeamAdapter implements ToolSeamAdapter {
  constructor(
    private readonly http: HttpClient,
    @Optional() @Inject(TOOL_SEAM_BASE_URL) private readonly baseUrl: string | null
  ) {}

  async invoke<TInput, TOutput>(contractName: string, payload: TInput): Promise<TOutput> {
    const normalizedBase = (this.baseUrl ?? '/api/tools').replace(/\/+$/, '');
    const endpoint = `${normalizedBase}/${contractName}`;
    return firstValueFrom(this.http.post<TOutput>(endpoint, payload));
  }
}
