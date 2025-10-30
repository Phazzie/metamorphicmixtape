import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SunoFormComponent } from './components/suno-form.component.js';
import { SunoShellComponent } from './components/suno-shell.component.js';
import { SunoService } from './suno.service.js';

@NgModule({
  declarations: [SunoShellComponent, SunoFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [SunoService],
  exports: [SunoShellComponent]
})
export class SunoModule {}
