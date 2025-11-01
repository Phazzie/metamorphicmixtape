import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolApiService } from './tool-api.service';
import { EmotionalArchaeologyRequest, EmotionalArchaeologyResponse, EvolutionTrackerRequest, EvolutionTrackerResponse } from '../models/analysis.models';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly toolApi = inject(ToolApiService);

  emotionalArchaeology(request: EmotionalArchaeologyRequest): Observable<EmotionalArchaeologyResponse> {
    return this.toolApi.executeTool<EmotionalArchaeologyRequest, EmotionalArchaeologyResponse>('emotional_archaeology', request);
  }

  evolutionTracker(request: EvolutionTrackerRequest): Observable<EvolutionTrackerResponse> {
    return this.toolApi.executeTool<EvolutionTrackerRequest, EvolutionTrackerResponse>('evolution_tracker', request);
  }
}
