import { HttpErrorResponse } from '@angular/common/http';

export class SeamRequestError extends Error {
  readonly seam: string;
  readonly status?: number;
  readonly cause?: unknown;

  constructor(seam: string, message: string, options?: { status?: number; cause?: unknown }) {
    super(message);
    this.name = 'SeamRequestError';
    this.seam = seam;
    this.status = options?.status;
    this.cause = options?.cause;
  }

  static fromHttpError(seam: string, error: unknown): SeamRequestError {
    if (error instanceof SeamRequestError) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      const status = error.status || undefined;
      const message =
        error.error?.message ||
        error.message ||
        `HTTP ${status ?? 'error'} while calling seam ${seam}`;
      return new SeamRequestError(seam, message, { status, cause: error });
    }

    return new SeamRequestError(seam, `Unexpected error invoking seam ${seam}`, { cause: error });
  }
}
