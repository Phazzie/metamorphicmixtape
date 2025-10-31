import { render, screen, fireEvent } from '@testing-library/angular';
import { of } from 'rxjs';

import { FormatForSunoRequestSchema, FormatForSunoResponseSchema } from '@metamorphic-mixtape/contracts/suno';
import { SunoModule } from '../../suno.module';
import { SunoService } from '../../services/suno.service';
import { SunoShellComponent } from './suno-shell.component';

describe('SunoShellComponent', () => {
  it('forwards formatted requests to the seam-backed service', async () => {
    const response = FormatForSunoResponseSchema.parse({
      formatted_lyrics: '[Verse 1] Example',
      structure_markers: ['[Verse 1]'],
      formatting_notes: 'notes',
      suno_best_practices: ['Use explicit markers']
    });

    const service = {
      formatLyrics: jasmine.createSpy('formatLyrics').and.returnValue(of(response))
    };

    await render(SunoShellComponent, {
      imports: [SunoModule],
      providers: [{ provide: SunoService, useValue: service }]
    });

    await fireEvent.input(screen.getByPlaceholderText('Paste the lyrics you want to format for Suno'), {
      target: { value: 'Sample lyrics ready for formatting' }
    });

    const submit = screen.getByRole('button', { name: /format for suno/i });
    await fireEvent.click(submit);

    expect(service.formatLyrics).toHaveBeenCalled();
    const payload = service.formatLyrics.calls.mostRecent().args[0];
    expect(() => FormatForSunoRequestSchema.parse(payload)).not.toThrow();
  });
});
