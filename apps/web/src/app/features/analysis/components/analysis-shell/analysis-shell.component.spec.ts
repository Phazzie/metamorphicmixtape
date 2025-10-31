import { render, screen, fireEvent } from '@testing-library/angular';
import { of } from 'rxjs';

import {
  EmotionalArchaeologyRequestSchema,
  EmotionalArchaeologyResponseSchema
} from '@metamorphic-mixtape/contracts/analysis';
import { AnalysisModule } from '../../analysis.module';
import { AnalysisService } from '../../services/analysis.service';
import { AnalysisShellComponent } from './analysis-shell.component';

describe('AnalysisShellComponent', () => {
  it('submits an emotional archaeology request that matches the contract', async () => {
    const response = EmotionalArchaeologyResponseSchema.parse({
      emotional_patterns: [],
      hidden_themes: [],
      temporal_patterns: {
        recurring_cycles: [],
        seasonal_themes: [],
        growth_areas: []
      },
      songwriting_prompts: [],
      creative_insights: []
    });

    const service = {
      runEmotionalArchaeology: jasmine.createSpy('runEmotionalArchaeology').and.returnValue(of(response))
    };

    await render(AnalysisShellComponent, {
      imports: [AnalysisModule],
      providers: [{ provide: AnalysisService, useValue: service }]
    });

    await fireEvent.input(screen.getByPlaceholderText('Recurring anxiety, dissolving friendships, etc.'), {
      target: { value: 'Recurring neon dreams' }
    });

    const submit = screen.getByRole('button', { name: /run emotional archaeology/i });
    await fireEvent.click(submit);

    expect(service.runEmotionalArchaeology).toHaveBeenCalled();
    const payload = service.runEmotionalArchaeology.calls.mostRecent().args[0];
    expect(() => EmotionalArchaeologyRequestSchema.parse(payload)).not.toThrow();
  });
});
