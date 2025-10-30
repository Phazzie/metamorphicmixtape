import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AnalysisFormComponent } from './components/analysis-form.component.js';
import { AnalysisShellComponent } from './components/analysis-shell.component.js';
import { AnalysisService } from './analysis.service.js';

@NgModule({
  declarations: [AnalysisShellComponent, AnalysisFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AnalysisService],
  exports: [AnalysisShellComponent]
})
export class AnalysisModule {}
