import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { FormatForSunoOutputDto } from '@metamorphic-mixtape/contracts';

import { SunoModule } from '../suno.module.js';
import { SunoService } from '../suno.service.js';
import { SunoShellComponent } from './suno-shell.component.js';

describe('SunoShellComponent', () => {
  it('routes the request through the SunoService and surfaces formatted output', async () => {
    const user = userEvent.setup();
    const response: FormatForSunoOutputDto = {
      formatted_lyrics: '[Intro]\nNeon tides rising\n',
      structure_markers: ['[Intro]', '[Verse 1]', '[Chorus]'],
      formatting_notes: 'Smoothed phrasing for vocal clarity.',
      suno_best_practices: ['Added explicit section markers', 'Balanced repetition to cue Suno']
    };

    const formatSpy = jasmine.createSpy('formatForSuno').and.resolveTo(response);

    await render(SunoShellComponent, {
      imports: [SunoModule],
      providers: [{ provide: SunoService, useValue: { formatForSuno: formatSpy } }]
    });

    await user.type(screen.getByLabelText(/lyrics/i), 'Neon tides rising');
    await user.click(screen.getByRole('button', { name: /format for suno/i }));

    expect(formatSpy).toHaveBeenCalled();

    const result = await screen.findByTestId('suno-result');
    expect(within(result).getByText(/Neon tides rising/i)).toBeTruthy();
    expect(within(result).getByText(/Intro/, { selector: 'p' })).toBeTruthy();
  });
});
