import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  EmotionalArchaeologyRequest,
  EmotionalArchaeologyResponse
} from '@metamorphic-mixtape/contracts/analysis';
import { AnalysisService } from '../../services/analysis.service';
import { toUserFacingMessage } from '../../../../core/errors/user-facing-error';

@Component({
  selector: 'app-analysis-shell',
  templateUrl: './analysis-shell.component.html',
  styleUrls: ['./analysis-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisShellComponent {
  loading = false;
  report?: EmotionalArchaeologyResponse;
  error?: string;

  constructor(private readonly analysis: AnalysisService) {}

  runAnalysis(request: EmotionalArchaeologyRequest): void {
    this.loading = true;
    this.error = undefined;
    this.analysis.runEmotionalArchaeology(request).subscribe({
      next: (response) => {
        this.report = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Analysis seam failure', err);
        this.error = toUserFacingMessage(
          err,
          'We could not complete the analysis. Try again later.'
        );
        this.loading = false;
      }
    });
  }
}
