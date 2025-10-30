import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { GenerateLyricsInputDto } from '@metamorphic-mixtape/contracts';

@Component({
  selector: 'app-songwriting-form',
  template: `
    <form class="songwriting-form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label class="form-field">
        <span>Concept *</span>
        <textarea
          formControlName="concept"
          rows="3"
          placeholder="e.g., Finding the light in a blackout city"
          required
        ></textarea>
      </label>

      <div class="form-grid">
        <label class="form-field">
          <span>Style</span>
          <select formControlName="style">
            <option *ngFor="let option of styles" [value]="option">{{ option }}</option>
          </select>
        </label>

        <label class="form-field">
          <span>Tone</span>
          <select formControlName="tone">
            <option *ngFor="let option of tones" [value]="option">{{ option }}</option>
          </select>
        </label>

        <label class="form-field">
          <span>Length</span>
          <select formControlName="length">
            <option *ngFor="let option of lengths" [value]="option">{{ option }}</option>
          </select>
        </label>
      </div>

      <label class="form-field">
        <span>Constraints</span>
        <input formControlName="constraints" placeholder="Optional creative constraints" />
      </label>

      <label class="form-field">
        <span>Reference Style</span>
        <input formControlName="reference_style" placeholder="Optional artist or vibe" />
      </label>

      <button type="submit" [disabled]="loading || form.invalid">{{ loading ? 'Generating…' : 'Generate Lyrics' }}</button>
    </form>
  `,
  styles: [
    `
      .songwriting-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      textarea,
      select,
      input {
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(17, 24, 39, 0.1);
        font-size: 0.95rem;
      }

      button {
        align-self: flex-start;
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        border: none;
        font-weight: 600;
        background: linear-gradient(135deg, #4f46e5, #ec4899);
        color: white;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongwritingFormComponent {
  @Input() loading = false;
  @Output() readonly submitted = new EventEmitter<GenerateLyricsInputDto>();

  readonly styles: GenerateLyricsInputDto['style'][] = ['verse-chorus', 'narrative', 'abstract', 'free-form'];
  readonly tones: GenerateLyricsInputDto['tone'][] = [
    'melancholic',
    'uplifting',
    'angry',
    'reflective',
    'playful',
    'dark',
    'hopeful',
    'bittersweet'
  ];
  readonly lengths: GenerateLyricsInputDto['length'][] = ['short', 'medium', 'long'];

  readonly form = this.fb.nonNullable.group({
    concept: ['', Validators.required],
    style: ['verse-chorus', Validators.required],
    tone: ['melancholic', Validators.required],
    length: ['medium', Validators.required],
    constraints: this.fb.control<string | null>(null),
    reference_style: this.fb.control<string | null>(null)
  });

  constructor(private readonly fb: FormBuilder) {}

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.submitted.emit({
      ...this.form.getRawValue(),
      constraints: this.form.value.constraints ?? undefined,
      reference_style: this.form.value.reference_style ?? undefined
    });
  }
}
