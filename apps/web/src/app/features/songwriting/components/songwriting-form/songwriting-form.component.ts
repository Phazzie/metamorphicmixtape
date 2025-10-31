import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { GenerateLyricsRequest } from '@metamorphic-mixtape/contracts/songwriting';

@Component({
  selector: 'app-songwriting-form',
  templateUrl: './songwriting-form.component.html',
  styleUrls: ['./songwriting-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongwritingFormComponent {
  @Input() loading = false;
  @Output() readonly generate = new EventEmitter<GenerateLyricsRequest>();

  readonly tones = ['melancholic', 'uplifting', 'angry', 'reflective', 'playful', 'dark', 'hopeful', 'bittersweet'];
  readonly styles = ['verse-chorus', 'narrative', 'abstract', 'free-form'];
  readonly lengths = ['short', 'medium', 'long'];

  readonly form = this.fb.group({
    concept: ['', Validators.required],
    tone: ['melancholic', Validators.required],
    style: ['verse-chorus', Validators.required],
    length: ['medium', Validators.required],
    constraints: [''],
    reference_style: ['']
  });

  constructor(private readonly fb: FormBuilder) {}

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { concept, tone, style, length, constraints, reference_style } = this.form.value;
    const request: GenerateLyricsRequest = {
      concept: concept ?? '',
      tone: (tone ?? 'melancholic') as GenerateLyricsRequest['tone'],
      style: (style ?? 'verse-chorus') as GenerateLyricsRequest['style'],
      length: (length ?? 'medium') as GenerateLyricsRequest['length'],
      ...(constraints ? { constraints } : {}),
      ...(reference_style ? { reference_style } : {})
    };

    this.generate.emit(request);
  }
}
