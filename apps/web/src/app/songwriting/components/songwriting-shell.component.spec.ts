import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { GenerateLyricsOutputDto } from '@metamorphic-mixtape/contracts';

import { SongwritingModule } from '../songwriting.module.js';
import { SongwritingService } from '../songwriting.service.js';
import { SongwritingShellComponent } from './songwriting-shell.component.js';

describe('SongwritingShellComponent', () => {
  it('delegates to the SongwritingService and surfaces the creative output', async () => {
    const user = userEvent.setup();
    const generateLyricsSpy = jasmine.createSpy('generateLyrics').and.resolveTo({
      lyrics: '[Chorus]\nLight the skyline lanterns high',
      structure: 'V1-C-V2-C',
      creative_notes: 'Contrasted darkness with beacons of light',
      emotional_arc: 'Begins anxious, ends triumphant',
      suggested_refinements: ['Consider a bridge with a quieter emotional tone']
    } satisfies GenerateLyricsOutputDto);

    await render(SongwritingShellComponent, {
      imports: [SongwritingModule],
      providers: [{ provide: SongwritingService, useValue: { generateLyrics: generateLyricsSpy } }]
    });

    await user.clear(screen.getByLabelText(/concept/i));
    await user.type(screen.getByLabelText(/concept/i), 'Citywide blackout finding hope');
    await user.click(screen.getByRole('button', { name: /generate lyrics/i }));

    expect(generateLyricsSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ concept: 'Citywide blackout finding hope' })
    );

    const result = await screen.findByTestId('songwriting-result');
    expect(within(result).getByText(/light the skyline lanterns/i)).toBeTruthy();
    expect(within(result).getByText(/V1-C-V2-C/)).toBeTruthy();
    expect(within(result).getByText(/contrasted darkness with beacons of light/i)).toBeTruthy();
  });
});
