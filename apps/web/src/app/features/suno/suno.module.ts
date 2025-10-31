import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SunoShellComponent } from './components/suno-shell/suno-shell.component';
import { SunoFormatComponent } from './components/suno-format/suno-format.component';

@NgModule({
  declarations: [SunoShellComponent, SunoFormatComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SunoShellComponent]
})
export class SunoModule {}
