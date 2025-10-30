import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReactiveFormsModule } from '@angular/forms';

import { AnalysisFormComponent } from './analysis-form.component.js';

describe('AnalysisFormComponent', () => {
  it('emits an EmotionalArchaeologyInputDto when submitted', async () => {
    const user = userEvent.setup();
    const submissionSpy = jasmine.createSpy('submission');

    const { fixture } = await render(AnalysisFormComponent, {
      imports: [ReactiveFormsModule]
    });
    fixture.componentInstance.submitted.subscribe(submissionSpy);

    await user.selectOptions(screen.getByLabelText(/data sources/i), ['messages', 'notes', 'calendar']);
    await user.selectOptions(screen.getByLabelText(/time period/i), 'all_time');
    await user.selectOptions(screen.getByLabelText(/emotional depth/i), 'subconscious');
    await user.selectOptions(screen.getByLabelText(/privacy level/i), 'personal');
    await user.type(screen.getByLabelText(/theme focus/i), 'Liminal thresholds');

    await user.click(screen.getByRole('button', { name: /run emotional archaeology/i }));

    expect(submissionSpy).toHaveBeenCalledTimes(1);
    expect(submissionSpy.calls.mostRecent().args[0]).toEqual({
      data_sources: ['messages', 'notes', 'calendar'],
      time_period: 'all_time',
      emotional_depth: 'subconscious',
      privacy_level: 'personal',
      theme_focus: 'Liminal thresholds'
    });
  });
});
