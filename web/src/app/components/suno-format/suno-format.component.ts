import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SunoService } from '../../services/suno.service';
import { FormatForSunoRequest, FormatForSunoResponse } from '../../models/suno.models';

@Component({
  selector: 'app-suno-format',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './suno-format.component.html',
  styleUrls: ['./suno-format.component.scss']
})
export class SunoFormatComponent {
  private readonly service = inject(SunoService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly result = signal<FormatForSunoResponse | null>(null);
  readonly error = signal<string | null>(null);

  readonly optimizationLevels = ['minimal', 'balanced', 'aggressive'] as const;

  readonly form = this.fb.group({
    lyrics: ['', Validators.required],
    optimization_level: ['balanced' as const, Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const request: FormatForSunoRequest = {
      lyrics: formValue.lyrics ?? '',
      optimization_level: formValue.optimization_level ?? 'balanced'
    };

    this.loading.set(true);
    this.error.set(null);

    this.service.formatForSuno(request).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to format for Suno', err);
        this.error.set(err.message || 'Failed to format lyrics. Please try again.');
        this.loading.set(false);
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        // Could add a toast notification here
        console.log('Copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy', err);
      }
    );
  }
}
