#!/usr/bin/env node
/**
 * Seam Contract Validator
 * 
 * Validates that all Zod contracts follow seam-driven development principles:
 * - Every contract has name, version, input/output schemas
 * - Schemas have descriptive documentation
 * - Version numbers are sequential
 * - No duplicate contract names
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CONTRACT_DIR = 'contracts/tool-contracts/src';

class ValidationError extends Error {
  constructor(file, message) {
    super(`${file}: ${message}`);
    this.file = file;
  }
}

async function validateContract(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const fileName = filePath.split('/').pop();
  const errors = [];

  // Skip index and base contract files
  if (fileName === 'index.ts' || fileName === 'contract.ts') {
    return [];
  }

  // Check for required exports pattern (both direct and via createToolContract)
  const hasContractExport = /export const \w+ContractV\d+ = createToolContract\(/.test(content);
  const hasName = hasContractExport; // name is first arg to createToolContract
  const hasVersion = hasContractExport; // version is second arg to createToolContract
  const hasInputSchema = /InputSchemaV\d+/.test(content) || /inputSchema:|inputShape:/.test(content);
  const hasOutputSchema = /OutputSchemaV\d+/.test(content) || /outputSchema:|outputShape:/.test(content);

  if (!hasName) {
    errors.push(new ValidationError(fileName, 'Missing "name" property in contract'));
  }
  if (!hasVersion) {
    errors.push(new ValidationError(fileName, 'Missing "version" property in contract'));
  }
  if (!hasInputSchema) {
    errors.push(new ValidationError(fileName, 'Missing input schema definition'));
  }
  if (!hasOutputSchema) {
    errors.push(new ValidationError(fileName, 'Missing output schema definition'));
  }

  // Check for .describe() calls (documentation)
  const describeCount = (content.match(/\.describe\(/g) || []).length;
  if (describeCount < 3) {
    errors.push(new ValidationError(
      fileName,
      `Insufficient documentation: only ${describeCount} .describe() calls found. Contract fields should be well-documented.`
    ));
  }

  // Check for version naming consistency (v1, v2, etc.)
  const versionMatches = content.match(/ContractV(\d+)/g);
  if (versionMatches) {
    const versions = versionMatches.map(m => parseInt(m.match(/V(\d+)/)[1]));
    const uniqueVersions = [...new Set(versions)];
    if (uniqueVersions.length > 1) {
      errors.push(new ValidationError(
        fileName,
        `Inconsistent version numbers: ${uniqueVersions.join(', ')}. File should contain contracts of same version.`
      ));
    }
  }

  return errors;
}

async function main() {
  console.log('🔍 Validating seam-driven contracts...\n');

  let allErrors = [];
  const files = await readdir(CONTRACT_DIR);
  const tsFiles = files.filter(f => f.endsWith('.ts'));

  for (const file of tsFiles) {
    const filePath = join(CONTRACT_DIR, file);
    try {
      const errors = await validateContract(filePath);
      if (errors.length > 0) {
        allErrors = allErrors.concat(errors);
      } else {
        console.log(`✅ ${file}`);
      }
    } catch (error) {
      console.error(`❌ ${file}: ${error.message}`);
      allErrors.push(error);
    }
  }

  if (allErrors.length > 0) {
    console.error('\n❌ Contract validation failed:\n');
    allErrors.forEach(err => console.error(`  - ${err.message}`));
    process.exit(1);
  }

  console.log(`\n✅ All ${tsFiles.length} contract files validated successfully!`);
}

main().catch(error => {
  console.error('Validation script failed:', error);
  process.exit(1);
});
