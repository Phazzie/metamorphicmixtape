import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FormatForSunoRequest } from '@metamorphic-mixtape/contracts/suno';

@Component({
  selector: 'app-suno-format',
  templateUrl: './suno-format.component.html',
  styleUrls: ['./suno-format.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunoFormatComponent {
  @Input() loading = false;
  @Output() readonly format = new EventEmitter<FormatForSunoRequest>();

  readonly optimizeOptions: FormatForSunoRequest['optimize_for'][] = ['clarity', 'creativity', 'balanced'];

  readonly form = this.fb.group({
    lyrics: ['', Validators.required],
    style_tags: [''],
    structure_explicit: [true],
    optimize_for: ['balanced', Validators.required]
  });

  constructor(private readonly fb: FormBuilder) {}

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { lyrics, style_tags, structure_explicit, optimize_for } = this.form.value;
    const request: FormatForSunoRequest = {
      lyrics: lyrics ?? '',
      ...(style_tags
        ? { style_tags: style_tags.split(',').map((tag) => tag.trim()).filter(Boolean) }
        : {}),
      structure_explicit: Boolean(structure_explicit),
      optimize_for: (optimize_for ?? 'balanced') as FormatForSunoRequest['optimize_for']
    };

    this.format.emit(request);
  }
}
