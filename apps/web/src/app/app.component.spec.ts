import { render, screen } from '@testing-library/angular';

import { AnalysisModule } from './analysis/analysis.module.js';
import { MockToolSeamAdapter } from './core/seams/tool-seam.mock.js';
import { TOOL_SEAM_ADAPTER } from './core/seams/tool-seam.adapter.js';
import { SongwritingModule } from './songwriting/songwriting.module.js';
import { SunoModule } from './suno/suno.module.js';
import { AppComponent } from './app.component.js';

describe('AppComponent', () => {
  it('renders the three creative workspaces', async () => {
    await render(AppComponent, {
      imports: [SongwritingModule, AnalysisModule, SunoModule],
      providers: [{ provide: TOOL_SEAM_ADAPTER, useClass: MockToolSeamAdapter }]
    });

    expect(screen.getByRole('heading', { name: /songwriting lab/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /analysis observatory/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /suno readiness/i })).toBeTruthy();
  });
});
