import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GenerateLyricsRequestSchema } from '@metamorphic-mixtape/contracts/songwriting';
import { SEAM_API_BASE_URL } from './seam-tokens';
import { SongwritingSeamAdapter } from './songwriting.seam';
import { SeamRequestError } from '../errors/seam-request.error';

describe('SongwritingSeamAdapter', () => {
  let adapter: SongwritingSeamAdapter;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://example.test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SEAM_API_BASE_URL, useValue: baseUrl }]
    });

    adapter = TestBed.inject(SongwritingSeamAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts generate lyrics requests to the seam endpoint', () => {
    const request = GenerateLyricsRequestSchema.parse({
      concept: 'Concept',
      tone: 'reflective',
      style: 'ballad',
      length: 'medium'
    });

    adapter.generateLyrics(request).subscribe();

    const httpRequest = httpMock.expectOne(`${baseUrl}/songwriting/generate-lyrics`);
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ ok: true });
  });

  it('throws a SeamRequestError when the HTTP layer fails', (done) => {
    const request = GenerateLyricsRequestSchema.parse({
      concept: 'Concept',
      tone: 'reflective',
      style: 'ballad',
      length: 'medium'
    });

    adapter.generateLyrics(request).subscribe({
      next: () => fail('Expected seam error'),
      error: (error) => {
        expect(error).toEqual(jasmine.any(SeamRequestError));
        expect((error as SeamRequestError).seam).toBe('songwriting.generateLyrics');
        expect((error as SeamRequestError).status).toBe(502);
        done();
      }
    });

    const httpRequest = httpMock.expectOne(`${baseUrl}/songwriting/generate-lyrics`);
    httpRequest.flush({ message: 'bad gateway' }, { status: 502, statusText: 'Bad Gateway' });
  });
});
