import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReactiveFormsModule } from '@angular/forms';

import { SunoFormComponent } from './suno-form.component.js';

describe('SunoFormComponent', () => {
  it('emits a FormatForSunoInputDto with parsed style tags', async () => {
    const user = userEvent.setup();
    const submissionSpy = jasmine.createSpy('submission');

    const { fixture } = await render(SunoFormComponent, {
      imports: [ReactiveFormsModule]
    });
    fixture.componentInstance.submitted.subscribe(submissionSpy);

    await user.type(screen.getByLabelText(/lyrics/i), 'Starlight on the fire escape');
    await user.type(screen.getByLabelText(/style tags/i), 'dream pop, cinematic, duet');
    await user.click(screen.getByLabelText(/include explicit structure markers/i));
    await user.selectOptions(screen.getByLabelText(/optimize for/i), 'clarity');

    await user.click(screen.getByRole('button', { name: /format for suno/i }));

    expect(submissionSpy).toHaveBeenCalledTimes(1);
    expect(submissionSpy.calls.mostRecent().args[0]).toEqual({
      lyrics: 'Starlight on the fire escape',
      style_tags: ['dream pop', 'cinematic', 'duet'],
      structure_explicit: false,
      optimize_for: 'clarity'
    });
  });
});
