import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AnalysisShellComponent } from './components/analysis-shell/analysis-shell.component';
import { AnalysisRequestComponent } from './components/analysis-request/analysis-request.component';

@NgModule({
  declarations: [AnalysisShellComponent, AnalysisRequestComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AnalysisShellComponent]
})
export class AnalysisModule {}
