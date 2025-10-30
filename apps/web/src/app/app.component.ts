import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell" data-testid="app-shell">
      <section class="section-card" aria-labelledby="songwriting-section">
        <h2 id="songwriting-section" class="section-title">Songwriting Lab</h2>
        <app-songwriting-shell></app-songwriting-shell>
      </section>

      <section class="section-card" aria-labelledby="analysis-section">
        <h2 id="analysis-section" class="section-title">Analysis Observatory</h2>
        <app-analysis-shell></app-analysis-shell>
      </section>

      <section class="section-card" aria-labelledby="suno-section">
        <h2 id="suno-section" class="section-title">Suno Readiness</h2>
        <app-suno-shell></app-suno-shell>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
