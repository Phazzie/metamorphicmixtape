import { ContractValidationError } from './contract-validation.error';
import { SeamRequestError } from './seam-request.error';

export function toUserFacingMessage(error: unknown, fallback: string): string {
  if (error instanceof ContractValidationError || error instanceof SeamRequestError) {
    return error.message;
  }

  return fallback;
}
