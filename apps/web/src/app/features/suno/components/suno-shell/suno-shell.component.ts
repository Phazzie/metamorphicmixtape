import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormatForSunoRequest, FormatForSunoResponse } from '@metamorphic-mixtape/contracts/suno';
import { SunoService } from '../../services/suno.service';
import { toUserFacingMessage } from '../../../../core/errors/user-facing-error';

@Component({
  selector: 'app-suno-shell',
  templateUrl: './suno-shell.component.html',
  styleUrls: ['./suno-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunoShellComponent {
  loading = false;
  formatted?: FormatForSunoResponse;
  error?: string;

  constructor(private readonly suno: SunoService) {}

  formatLyrics(request: FormatForSunoRequest): void {
    this.loading = true;
    this.error = undefined;
    this.suno.formatLyrics(request).subscribe({
      next: (response) => {
        this.formatted = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Suno seam failure', err);
        this.error = toUserFacingMessage(
          err,
          'Unable to format lyrics for Suno right now.'
        );
        this.loading = false;
      }
    });
  }
}
