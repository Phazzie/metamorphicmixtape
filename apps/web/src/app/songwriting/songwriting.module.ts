import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SongwritingFormComponent } from './components/songwriting-form.component.js';
import { SongwritingShellComponent } from './components/songwriting-shell.component.js';
import { SongwritingService } from './songwriting.service.js';

@NgModule({
  declarations: [SongwritingShellComponent, SongwritingFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [SongwritingService],
  exports: [SongwritingShellComponent]
})
export class SongwritingModule {}
