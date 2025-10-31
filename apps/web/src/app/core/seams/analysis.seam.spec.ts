import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EmotionalArchaeologyRequestSchema } from '@metamorphic-mixtape/contracts/analysis';
import { SEAM_API_BASE_URL } from './seam-tokens';
import { AnalysisSeamAdapter } from './analysis.seam';
import { SeamRequestError } from '../errors/seam-request.error';

describe('AnalysisSeamAdapter', () => {
  let adapter: AnalysisSeamAdapter;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://example.test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SEAM_API_BASE_URL, useValue: baseUrl }]
    });

    adapter = TestBed.inject(AnalysisSeamAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls the emotional archaeology seam with the correct URL', () => {
    const request = EmotionalArchaeologyRequestSchema.parse({
      data_sources: ['messages'],
      time_period: 'last_month',
      emotional_depth: 'moderate',
      privacy_level: 'anonymous'
    });

    adapter.emotionalArchaeology(request).subscribe();

    const httpRequest = httpMock.expectOne(`${baseUrl}/analysis/emotional-archaeology`);
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ ok: true });
  });

  it('wraps HTTP failures in a SeamRequestError', (done) => {
    const request = EmotionalArchaeologyRequestSchema.parse({
      data_sources: ['messages'],
      time_period: 'last_month',
      emotional_depth: 'moderate',
      privacy_level: 'anonymous'
    });

    adapter.emotionalArchaeology(request).subscribe({
      next: () => fail('Expected seam error'),
      error: (error) => {
        expect(error).toEqual(jasmine.any(SeamRequestError));
        expect((error as SeamRequestError).seam).toBe('analysis.emotionalArchaeology');
        expect((error as SeamRequestError).status).toBe(500);
        done();
      }
    });

    const httpRequest = httpMock.expectOne(`${baseUrl}/analysis/emotional-archaeology`);
    httpRequest.flush({ message: 'boom' }, { status: 500, statusText: 'Server error' });
  });
});
