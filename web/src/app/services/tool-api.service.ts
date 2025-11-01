import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ToolResponse<T = unknown> {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ToolApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  executeTool<TRequest, TResponse>(toolName: string, request: TRequest): Observable<TResponse> {
    const url = `${this.baseUrl}/tools/${toolName}`;
    
    return this.http.post<ToolResponse<TResponse>>(url, request).pipe(
      map(response => {
        if (response.structuredContent) {
          return response.structuredContent;
        }
        if (response.content && response.content.length > 0) {
          const textContent = response.content[0].text;
          try {
            return JSON.parse(textContent) as TResponse;
          } catch {
            throw new Error('Unable to parse response content');
          }
        }
        throw new Error('No structured content in response');
      })
    );
  }
}
