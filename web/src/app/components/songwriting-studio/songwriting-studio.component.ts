import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SongwritingService } from '../../services/songwriting.service';
import { GenerateLyricsRequest, GenerateLyricsResponse } from '../../models/songwriting.models';

@Component({
  selector: 'app-songwriting-studio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './songwriting-studio.component.html',
  styleUrls: ['./songwriting-studio.component.scss']
})
export class SongwritingStudioComponent {
  private readonly service = inject(SongwritingService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly result = signal<GenerateLyricsResponse | null>(null);
  readonly error = signal<string | null>(null);

  readonly tones = ['melancholic', 'uplifting', 'angry', 'reflective', 'playful', 'dark', 'hopeful', 'bittersweet'] as const;
  readonly styles = ['verse-chorus', 'narrative', 'abstract', 'free-form'] as const;
  readonly lengths = ['short', 'medium', 'long'] as const;

  readonly form = this.fb.group({
    concept: ['', Validators.required],
    tone: ['melancholic' as const, Validators.required],
    style: ['verse-chorus' as const, Validators.required],
    length: ['medium' as const, Validators.required],
    constraints: [''],
    reference_style: ['']
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const request: GenerateLyricsRequest = {
      concept: formValue.concept ?? '',
      tone: formValue.tone ?? 'melancholic',
      style: formValue.style ?? 'verse-chorus',
      length: formValue.length ?? 'medium',
      ...(formValue.constraints && { constraints: formValue.constraints }),
      ...(formValue.reference_style && { reference_style: formValue.reference_style })
    };

    this.loading.set(true);
    this.error.set(null);

    this.service.generateLyrics(request).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to generate lyrics', err);
        this.error.set(err.message || 'Failed to generate lyrics. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
