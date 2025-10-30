import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormatForSunoInputDto, FormatForSunoOutputDto } from '@metamorphic-mixtape/contracts';

import { SunoService } from '../suno.service.js';

@Component({
  selector: 'app-suno-shell',
  template: `
    <app-suno-form [loading]="loading" (submitted)="onSubmitted($event)"></app-suno-form>

    <section *ngIf="result" class="suno-result" data-testid="suno-result">
      <h3>Suno-Ready Blueprint</h3>
      <pre>{{ result.formatted_lyrics }}</pre>
      <p><strong>Structure Markers:</strong> {{ result.structure_markers.join(', ') }}</p>
      <p><strong>Formatting Notes:</strong> {{ result.formatting_notes }}</p>
      <h4>Applied Best Practices</h4>
      <ul>
        <li *ngFor="let tip of result.suno_best_practices">{{ tip }}</li>
      </ul>
    </section>
  `,
  styles: [
    `
      .suno-result {
        margin-top: 1.5rem;
        padding: 1.25rem;
        border-radius: 1rem;
        border: 1px solid rgba(248, 113, 113, 0.35);
        background: rgba(251, 113, 133, 0.08);
        display: grid;
        gap: 0.75rem;
      }

      pre {
        white-space: pre-wrap;
        background: #111827;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 0.75rem;
      }

      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunoShellComponent {
  loading = false;
  result: FormatForSunoOutputDto | null = null;

  constructor(private readonly sunoService: SunoService) {}

  async onSubmitted(input: FormatForSunoInputDto): Promise<void> {
    this.loading = true;
    try {
      this.result = await this.sunoService.formatForSuno(input);
    } finally {
      this.loading = false;
    }
  }
}
