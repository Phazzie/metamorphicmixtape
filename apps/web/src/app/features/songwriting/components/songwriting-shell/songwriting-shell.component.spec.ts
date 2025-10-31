import { render, screen, fireEvent } from '@testing-library/angular';
import { of } from 'rxjs';

import {
  GenerateLyricsRequestSchema,
  GenerateLyricsResponseSchema
} from '@metamorphic-mixtape/contracts/songwriting';
import { SongwritingModule } from '../../songwriting.module';
import { SongwritingService } from '../../services/songwriting.service';
import { SongwritingShellComponent } from './songwriting-shell.component';

describe('SongwritingShellComponent', () => {
  it('delegates to the service with a contract-compliant payload', async () => {
    const response = GenerateLyricsResponseSchema.parse({
      lyrics: '[Verse 1] Example',
      structure: 'V1-C',
      creative_notes: 'notes',
      emotional_arc: 'arc',
      suggested_refinements: ['refine imagery']
    });

    const service = {
      generateLyrics: jasmine.createSpy('generateLyrics').and.returnValue(of(response))
    };

    await render(SongwritingShellComponent, {
      imports: [SongwritingModule],
      providers: [{ provide: SongwritingService, useValue: service }]
    });

    await fireEvent.input(screen.getByPlaceholderText('A concept, theme, or story'), {
      target: { value: 'Lost signals over a midnight city' }
    });

    const submit = screen.getByRole('button', { name: /generate lyrics/i });
    await fireEvent.click(submit);

    expect(service.generateLyrics).toHaveBeenCalled();
    const request = service.generateLyrics.calls.mostRecent().args[0];
    expect(() => GenerateLyricsRequestSchema.parse(request)).not.toThrow();
  });
});
