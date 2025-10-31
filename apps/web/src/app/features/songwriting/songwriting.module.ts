import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SongwritingShellComponent } from './components/songwriting-shell/songwriting-shell.component';
import { SongwritingFormComponent } from './components/songwriting-form/songwriting-form.component';

@NgModule({
  declarations: [SongwritingShellComponent, SongwritingFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SongwritingShellComponent]
})
export class SongwritingModule {}
