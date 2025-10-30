import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component.js';
import { AnalysisModule } from './analysis/analysis.module.js';
import { HttpToolSeamAdapter } from './core/seams/http-tool-seam.adapter.js';
import { TOOL_SEAM_ADAPTER } from './core/seams/tool-seam.adapter.js';
import { SongwritingModule } from './songwriting/songwriting.module.js';
import { SunoModule } from './suno/suno.module.js';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, SongwritingModule, AnalysisModule, SunoModule],
  providers: [{ provide: TOOL_SEAM_ADAPTER, useClass: HttpToolSeamAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule {}
