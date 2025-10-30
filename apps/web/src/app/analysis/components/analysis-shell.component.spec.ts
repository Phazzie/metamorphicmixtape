import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { EmotionalArchaeologyOutputDto } from '@metamorphic-mixtape/contracts';

import { AnalysisModule } from '../analysis.module.js';
import { AnalysisService } from '../analysis.service.js';
import { AnalysisShellComponent } from './analysis-shell.component.js';

describe('AnalysisShellComponent', () => {
  it('calls the seam adapter backed service and renders structured insights', async () => {
    const user = userEvent.setup();
    const response: EmotionalArchaeologyOutputDto = {
      emotional_patterns: [
        {
          theme: 'Citylight nostalgia',
          intensity: 7,
          frequency: 'Biweekly pulses',
          context: 'Late-night playlist loops',
          song_potential: 'Translate into a synthwave nocturne'
        }
      ],
      hidden_themes: [
        {
          theme: 'Unfinished conversations',
          evidence: ['Drafted messages', 'Unsent voice memos'],
          creative_angle: 'Answer them through duet-style lyrics'
        }
      ],
      temporal_patterns: {
        recurring_cycles: ['Sunday reflections'],
        seasonal_themes: ['Summer nostalgia'],
        growth_areas: ['Sharing works in progress earlier']
      },
      songwriting_prompts: ['Score the moment the city exhales after rain.'],
      creative_insights: ['Your clarity spikes right after collaborative jams.']
    };

    const runSpy = jasmine.createSpy('runEmotionalArchaeology').and.resolveTo(response);

    await render(AnalysisShellComponent, {
      imports: [AnalysisModule],
      providers: [{ provide: AnalysisService, useValue: { runEmotionalArchaeology: runSpy } }]
    });

    await user.selectOptions(screen.getByLabelText(/data sources/i), ['messages', 'notes']);
    await user.click(screen.getByRole('button', { name: /run emotional archaeology/i }));

    expect(runSpy).toHaveBeenCalled();

    const result = await screen.findByTestId('analysis-result');
    expect(within(result).getByText(/citylight nostalgia/i)).toBeTruthy();
    expect(within(result).getByText(/synthwave nocturne/i)).toBeTruthy();
    expect(within(result).getByText(/Sunday reflections/i)).toBeTruthy();
  });
});
