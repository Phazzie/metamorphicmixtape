import { ZodSchema } from 'zod';

import { ContractValidationError } from '../errors/contract-validation.error';

export function parseWithContract<T>(schema: ZodSchema<T>, value: unknown, contract: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new ContractValidationError(contract, result.error.issues);
  }

  return result.data;
}
