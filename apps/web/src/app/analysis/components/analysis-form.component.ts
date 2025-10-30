import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { EmotionalArchaeologyInputDto } from '@metamorphic-mixtape/contracts';

@Component({
  selector: 'app-analysis-form',
  template: `
    <form class="analysis-form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label class="form-field">
        <span>Data Sources *</span>
        <select formControlName="data_sources" multiple required>
          <option *ngFor="let option of dataSources" [value]="option">{{ option }}</option>
        </select>
        <small>Hold Cmd/Ctrl to select multiple sources.</small>
      </label>

      <div class="form-grid">
        <label class="form-field">
          <span>Time Period</span>
          <select formControlName="time_period">
            <option *ngFor="let option of timePeriods" [value]="option">{{ option }}</option>
          </select>
        </label>

        <label class="form-field">
          <span>Emotional Depth</span>
          <select formControlName="emotional_depth">
            <option *ngFor="let option of depths" [value]="option">{{ option }}</option>
          </select>
        </label>

        <label class="form-field">
          <span>Privacy Level</span>
          <select formControlName="privacy_level">
            <option *ngFor="let option of privacyLevels" [value]="option">{{ option }}</option>
          </select>
        </label>
      </div>

      <label class="form-field">
        <span>Theme Focus</span>
        <input formControlName="theme_focus" placeholder="Optional focus (e.g., recurring dreams)" />
      </label>

      <button type="submit" [disabled]="loading || form.invalid">
        {{ loading ? 'Analyzing…' : 'Run Emotional Archaeology' }}
      </button>
    </form>
  `,
  styles: [
    `
      .analysis-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      select,
      input {
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(17, 24, 39, 0.1);
      }

      select[multiple] {
        min-height: 6rem;
      }

      button {
        align-self: flex-start;
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #14b8a6, #2563eb);
        color: white;
        border: none;
        font-weight: 600;
      }

      button:disabled {
        opacity: 0.6;
      }

      small {
        color: rgba(17, 24, 39, 0.6);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisFormComponent {
  @Input() loading = false;
  @Output() readonly submitted = new EventEmitter<EmotionalArchaeologyInputDto>();

  readonly dataSources: EmotionalArchaeologyInputDto['data_sources'] = [
    'messages',
    'emails',
    'search_history',
    'music_played',
    'social_media',
    'notes',
    'calendar'
  ];
  readonly timePeriods: EmotionalArchaeologyInputDto['time_period'][] = [
    'last_week',
    'last_month',
    'last_3_months',
    'last_year',
    'all_time'
  ];
  readonly depths: EmotionalArchaeologyInputDto['emotional_depth'][] = [
    'surface',
    'moderate',
    'deep',
    'subconscious'
  ];
  readonly privacyLevels: EmotionalArchaeologyInputDto['privacy_level'][] = [
    'anonymous',
    'pseudonymous',
    'personal'
  ];

  readonly form = this.fb.nonNullable.group({
    data_sources: this.fb.nonNullable.control<EmotionalArchaeologyInputDto['data_sources']>(['messages'], [
      Validators.required
    ]),
    time_period: this.fb.nonNullable.control<EmotionalArchaeologyInputDto['time_period']>('last_month'),
    emotional_depth: this.fb.nonNullable.control<EmotionalArchaeologyInputDto['emotional_depth']>('moderate'),
    privacy_level: this.fb.nonNullable.control<EmotionalArchaeologyInputDto['privacy_level']>('anonymous'),
    theme_focus: this.fb.control<string | null>(null)
  });

  constructor(private readonly fb: FormBuilder) {}

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({
      data_sources: value.data_sources,
      time_period: value.time_period,
      emotional_depth: value.emotional_depth,
      privacy_level: value.privacy_level,
      theme_focus: value.theme_focus ?? undefined
    });
  }
}
