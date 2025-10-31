import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  GenerateLyricsRequest,
  GenerateLyricsResponse
} from '@metamorphic-mixtape/contracts/songwriting';
import { SongwritingService } from '../../services/songwriting.service';
import { toUserFacingMessage } from '../../../../core/errors/user-facing-error';

@Component({
  selector: 'app-songwriting-shell',
  templateUrl: './songwriting-shell.component.html',
  styleUrls: ['./songwriting-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongwritingShellComponent {
  loading = false;
  result?: GenerateLyricsResponse;
  error?: string;

  constructor(private readonly songwriting: SongwritingService) {}

  handleGenerate(request: GenerateLyricsRequest): void {
    this.loading = true;
    this.error = undefined;
    this.songwriting.generateLyrics(request).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Songwriting seam failure', err);
        this.error = toUserFacingMessage(
          err,
          'We could not reach the songwriting seam. Try again shortly.'
        );
        this.loading = false;
      }
    });
  }
}
