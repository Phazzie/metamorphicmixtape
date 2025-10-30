import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  EmotionalArchaeologyInputDto,
  EmotionalArchaeologyOutputDto
} from '@metamorphic-mixtape/contracts';

import { AnalysisService } from '../analysis.service.js';

@Component({
  selector: 'app-analysis-shell',
  template: `
    <app-analysis-form [loading]="loading" (submitted)="runAnalysis($event)"></app-analysis-form>

    <section *ngIf="result" class="analysis-result" data-testid="analysis-result">
      <h3>Creative Insights</h3>

      <h4>Emotional Patterns</h4>
      <ul>
        <li *ngFor="let pattern of result.emotional_patterns">
          <strong>{{ pattern.theme }}</strong>
          <span> · intensity {{ pattern.intensity }}/10 · {{ pattern.frequency }}</span>
          <p>{{ pattern.context }}</p>
        </li>
      </ul>

      <h4>Hidden Themes</h4>
      <ul>
        <li *ngFor="let theme of result.hidden_themes">
          <strong>{{ theme.theme }}</strong>
          <p>{{ theme.creative_angle }}</p>
        </li>
      </ul>

      <h4>Temporal Patterns</h4>
      <ul>
        <li>Cycles: {{ result.temporal_patterns.recurring_cycles.join(', ') }}</li>
        <li>Seasonal: {{ result.temporal_patterns.seasonal_themes.join(', ') }}</li>
        <li>Growth: {{ result.temporal_patterns.growth_areas.join(', ') }}</li>
      </ul>

      <h4>Songwriting Prompts</h4>
      <ul>
        <li *ngFor="let prompt of result.songwriting_prompts">{{ prompt }}</li>
      </ul>
    </section>
  `,
  styles: [
    `
      .analysis-result {
        margin-top: 1.5rem;
        padding: 1.25rem;
        background: rgba(14, 165, 233, 0.1);
        border-radius: 1rem;
        border: 1px solid rgba(14, 165, 233, 0.2);
        display: grid;
        gap: 1rem;
      }

      ul {
        margin: 0;
        padding-left: 1.25rem;
      }

      li {
        margin-bottom: 0.5rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisShellComponent {
  loading = false;
  result: EmotionalArchaeologyOutputDto | null = null;

  constructor(private readonly analysisService: AnalysisService) {}

  async runAnalysis(input: EmotionalArchaeologyInputDto): Promise<void> {
    this.loading = true;
    try {
      this.result = await this.analysisService.runEmotionalArchaeology(input);
    } finally {
      this.loading = false;
    }
  }
}
