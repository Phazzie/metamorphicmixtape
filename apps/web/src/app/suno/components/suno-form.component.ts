import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FormatForSunoInputDto } from '@metamorphic-mixtape/contracts';

@Component({
  selector: 'app-suno-form',
  template: `
    <form class="suno-form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label class="form-field">
        <span>Lyrics *</span>
        <textarea
          formControlName="lyrics"
          rows="6"
          placeholder="Paste the lyrics you want to format for Suno"
          required
        ></textarea>
      </label>

      <label class="form-field">
        <span>Style Tags (comma separated)</span>
        <input formControlName="style_tags_text" placeholder="e.g., indie folk, female vocals, lo-fi" />
      </label>

      <label class="form-toggle">
        <input type="checkbox" formControlName="structure_explicit" />
        <span>Include explicit structure markers</span>
      </label>

      <label class="form-field">
        <span>Optimize For</span>
        <select formControlName="optimize_for">
          <option value="clarity">clarity</option>
          <option value="creativity">creativity</option>
          <option value="balanced">balanced</option>
        </select>
      </label>

      <button type="submit" [disabled]="loading || form.invalid">
        {{ loading ? 'Formatting…' : 'Format for Suno' }}
      </button>
    </form>
  `,
  styles: [
    `
      .suno-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      textarea,
      input,
      select {
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(17, 24, 39, 0.1);
      }

      .form-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      button {
        align-self: flex-start;
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #fb7185, #f97316);
        color: white;
        border: none;
        font-weight: 600;
      }

      button:disabled {
        opacity: 0.6;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunoFormComponent {
  @Input() loading = false;
  @Output() readonly submitted = new EventEmitter<FormatForSunoInputDto>();

  readonly form = this.fb.nonNullable.group({
    lyrics: ['', Validators.required],
    style_tags_text: this.fb.control<string | null>(null),
    structure_explicit: this.fb.nonNullable.control<boolean>(true),
    optimize_for: this.fb.nonNullable.control<FormatForSunoInputDto['optimize_for']>('balanced')
  });

  constructor(private readonly fb: FormBuilder) {}

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    const raw = this.form.getRawValue();
    const styleTags = raw.style_tags_text
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => !!tag.length);

    this.submitted.emit({
      lyrics: raw.lyrics,
      structure_explicit: raw.structure_explicit,
      optimize_for: raw.optimize_for,
      style_tags: styleTags && styleTags.length > 0 ? styleTags : undefined
    });
  }
}
