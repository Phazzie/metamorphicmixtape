import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FormatForSunoRequestSchema } from '@metamorphic-mixtape/contracts/suno';
import { SEAM_API_BASE_URL } from './seam-tokens';
import { SunoSeamAdapter } from './suno.seam';
import { SeamRequestError } from '../errors/seam-request.error';

describe('SunoSeamAdapter', () => {
  let adapter: SunoSeamAdapter;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://example.test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SEAM_API_BASE_URL, useValue: baseUrl }]
    });

    adapter = TestBed.inject(SunoSeamAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts format requests to the Suno seam endpoint', () => {
    const request = FormatForSunoRequestSchema.parse({
      lyrics: 'Lyrics',
      structure_explicit: true,
      optimize_for: 'balanced'
    });

    adapter.formatLyrics(request).subscribe();

    const httpRequest = httpMock.expectOne(`${baseUrl}/suno/format`);
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ ok: true });
  });

  it('wraps HTTP errors as SeamRequestError instances', (done) => {
    const request = FormatForSunoRequestSchema.parse({
      lyrics: 'Lyrics',
      structure_explicit: true,
      optimize_for: 'balanced'
    });

    adapter.formatLyrics(request).subscribe({
      next: () => fail('Expected seam error'),
      error: (error) => {
        expect(error).toEqual(jasmine.any(SeamRequestError));
        expect((error as SeamRequestError).seam).toBe('suno.formatLyrics');
        expect((error as SeamRequestError).status).toBe(503);
        done();
      }
    });

    const httpRequest = httpMock.expectOne(`${baseUrl}/suno/format`);
    httpRequest.flush({ message: 'service unavailable' }, { status: 503, statusText: 'Service Unavailable' });
  });
});
