import { ZodIssue } from 'zod';

export class ContractValidationError extends Error {
  readonly issues: ReadonlyArray<ZodIssue>;
  readonly contract: string;

  constructor(contract: string, issues: ReadonlyArray<ZodIssue>) {
    const formattedIssues = issues.map((issue) => issue.message).join('; ');
    super(`Contract validation failed for ${contract}: ${formattedIssues}`);
    this.name = 'ContractValidationError';
    this.contract = contract;
    this.issues = issues;
  }
}
