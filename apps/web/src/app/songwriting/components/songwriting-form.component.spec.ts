import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReactiveFormsModule } from '@angular/forms';

import { SongwritingFormComponent } from './songwriting-form.component.js';

describe('SongwritingFormComponent', () => {
  it('emits a GenerateLyricsInputDto when submitted', async () => {
    const user = userEvent.setup();
    const submissionSpy = jasmine.createSpy('submission');

    const { fixture } = await render(SongwritingFormComponent, {
      imports: [ReactiveFormsModule]
    });
    fixture.componentInstance.submitted.subscribe(submissionSpy);

    await user.clear(screen.getByLabelText(/concept/i));
    await user.type(screen.getByLabelText(/concept/i), 'Signal fires across the skyline');

    await user.selectOptions(screen.getByLabelText(/style/i), 'narrative');
    await user.selectOptions(screen.getByLabelText(/tone/i), 'reflective');
    await user.selectOptions(screen.getByLabelText(/length/i), 'long');

    await user.type(screen.getByLabelText(/constraints/i), 'Use synesthetic imagery');
    await user.type(screen.getByLabelText(/reference style/i), 'Bon Iver abstraction');

    await user.click(screen.getByRole('button', { name: /generate lyrics/i }));

    expect(submissionSpy).toHaveBeenCalledTimes(1);
    expect(submissionSpy.calls.mostRecent().args[0]).toEqual({
      concept: 'Signal fires across the skyline',
      style: 'narrative',
      tone: 'reflective',
      length: 'long',
      constraints: 'Use synesthetic imagery',
      reference_style: 'Bon Iver abstraction'
    });
  });
});
