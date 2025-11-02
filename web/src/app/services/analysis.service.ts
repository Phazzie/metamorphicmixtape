import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolApiService } from './tool-api.service';
import { EmotionalArchaeologyRequest, EmotionalArchaeologyResponse, EvolutionTrackerRequest, EvolutionTrackerResponse } from '../models/analysis.models';

/**
 * AnalysisService - Analysis Tools Seam
 * 
 * @seam AnalysisSeam
 * @contract ../contracts/AnalysisSeam.contract.v1.yml
 * @version 1
 * 
 * This service implements the AnalysisSeam contract, providing access to:
 * - emotional_archaeology: Mine digital life for authentic song themes
 * - evolution_tracker: Track creative growth across songs
 * 
 * Delegates to ToolApiSeam for HTTP communication.
 * Models match backend contracts in contracts/tool-contracts/src/analysis.ts
 * 
 * See contract for: tool specs, inputs, outputs, errors, examples, validation
 */

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
