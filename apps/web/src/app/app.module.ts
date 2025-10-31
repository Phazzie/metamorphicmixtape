import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SongwritingModule } from './features/songwriting/songwriting.module';
import { AnalysisModule } from './features/analysis/analysis.module';
import { SunoModule } from './features/suno/suno.module';
import { SEAM_API_BASE_URL } from './core/seams/seam-tokens';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, SongwritingModule, AnalysisModule, SunoModule],
  providers: [
    {
      provide: SEAM_API_BASE_URL,
      useValue: '/api/seams'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
