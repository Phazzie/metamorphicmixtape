import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GenerateLyricsInputDto, GenerateLyricsOutputDto } from '@metamorphic-mixtape/contracts';

import { SongwritingService } from '../songwriting.service.js';

@Component({
  selector: 'app-songwriting-shell',
  template: `
    <app-songwriting-form [loading]="loading" (submitted)="handleSubmitted($event)"></app-songwriting-form>

    <article *ngIf="result" class="result" data-testid="songwriting-result">
      <h3>Generated Lyrics</h3>
      <pre>{{ result.lyrics }}</pre>
      <dl>
        <div>
          <dt>Structure</dt>
          <dd>{{ result.structure }}</dd>
        </div>
        <div>
          <dt>Creative Notes</dt>
          <dd>{{ result.creative_notes }}</dd>
        </div>
        <div>
          <dt>Emotional Arc</dt>
          <dd>{{ result.emotional_arc }}</dd>
        </div>
      </dl>
      <section>
        <h4>Suggested Refinements</h4>
        <ul>
          <li *ngFor="let refinement of result.suggested_refinements">{{ refinement }}</li>
        </ul>
      </section>
    </article>
  `,
  styles: [
    `
      .result {
        margin-top: 1.5rem;
        padding: 1rem 1.5rem;
        background: rgba(99, 102, 241, 0.08);
        border-radius: 1rem;
        border: 1px solid rgba(79, 70, 229, 0.2);
      }

      pre {
        white-space: pre-wrap;
        background: rgba(15, 23, 42, 0.85);
        color: white;
        padding: 1rem;
        border-radius: 0.75rem;
      }

      dl {
        display: grid;
        gap: 0.5rem;
        margin: 1rem 0;
      }

      dt {
        font-weight: 600;
      }

      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongwritingShellComponent {
  loading = false;
  result: GenerateLyricsOutputDto | null = null;

  constructor(private readonly songwritingService: SongwritingService) {}

  async handleSubmitted(input: GenerateLyricsInputDto): Promise<void> {
    this.loading = true;
    try {
      this.result = await this.songwritingService.generateLyrics(input);
    } finally {
      this.loading = false;
    }
  }
}
