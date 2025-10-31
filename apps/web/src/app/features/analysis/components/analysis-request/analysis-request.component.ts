import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { EmotionalArchaeologyRequest } from '@metamorphic-mixtape/contracts/analysis';

@Component({
  selector: 'app-analysis-request',
  templateUrl: './analysis-request.component.html',
  styleUrls: ['./analysis-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisRequestComponent {
  @Input() loading = false;
  @Output() readonly analyze = new EventEmitter<EmotionalArchaeologyRequest>();

  readonly dataSourceOptions: EmotionalArchaeologyRequest['data_sources'] = [
    'messages',
    'emails',
    'search_history',
    'music_played',
    'social_media',
    'notes',
    'calendar'
  ];
  readonly timePeriods: EmotionalArchaeologyRequest['time_period'][] = [
    'last_week',
    'last_month',
    'last_3_months',
    'last_year',
    'all_time'
  ];
  readonly depths: EmotionalArchaeologyRequest['emotional_depth'][] = ['surface', 'moderate', 'deep', 'subconscious'];
  readonly privacyModes: EmotionalArchaeologyRequest['privacy_level'][] = ['anonymous', 'pseudonymous', 'personal'];

  readonly form = this.fb.group({
    data_sources: this.fb.control<EmotionalArchaeologyRequest['data_sources']>(['messages']),
    time_period: this.fb.control<EmotionalArchaeologyRequest['time_period']>('last_month', Validators.required),
    emotional_depth: this.fb.control<EmotionalArchaeologyRequest['emotional_depth']>('moderate', Validators.required),
    privacy_level: this.fb.control<EmotionalArchaeologyRequest['privacy_level']>('anonymous', Validators.required),
    theme_focus: this.fb.control<string>('')
  });

  constructor(private readonly fb: FormBuilder) {}

  toggleSource(option: EmotionalArchaeologyRequest['data_sources'][number], checked: boolean): void {
    const current = this.form.controls.data_sources.value ?? [];
    const next = checked ? Array.from(new Set([...current, option])) : current.filter((item) => item !== option);
    this.form.controls.data_sources.setValue(next.length ? next : [option]);
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { data_sources, time_period, emotional_depth, privacy_level, theme_focus } = this.form.value;
    const request: EmotionalArchaeologyRequest = {
      data_sources: (data_sources && data_sources.length ? data_sources : ['messages']) as EmotionalArchaeologyRequest['data_sources'],
      time_period: (time_period ?? 'last_month') as EmotionalArchaeologyRequest['time_period'],
      emotional_depth: (emotional_depth ?? 'moderate') as EmotionalArchaeologyRequest['emotional_depth'],
      privacy_level: (privacy_level ?? 'anonymous') as EmotionalArchaeologyRequest['privacy_level'],
      ...(theme_focus ? { theme_focus } : {})
    };

    this.analyze.emit(request);
  }
}
