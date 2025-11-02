#!/usr/bin/env node
/**
 * Zod Contract Linter
 * 
 * Lints Zod schemas for seam-driven development best practices:
 * - All fields have .describe() documentation
 * - Enums have all values documented
 * - Complex types have examples
 * - Optional vs required is explicit
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CONTRACT_DIR = 'contracts/tool-contracts/src';

class LintWarning {
  constructor(file, line, message, severity = 'warning') {
    this.file = file;
    this.line = line;
    this.message = message;
    this.severity = severity;
  }

  toString() {
    const icon = this.severity === 'error' ? '❌' : '⚠️';
    return `${icon} ${this.file}:${this.line} - ${this.message}`;
  }
}

function lintContract(content, fileName) {
  const warnings = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for z.string(), z.number(), etc without .describe()
    const zodTypePattern = /z\.(string|number|boolean|array|object)\(\)/;
    if (zodTypePattern.test(line) && !line.includes('.describe(')) {
      // Check if next line has .describe()
      const nextLine = lines[index + 1] || '';
      if (!nextLine.trim().startsWith('.describe(')) {
        warnings.push(new LintWarning(
          fileName,
          lineNum,
          'Zod field missing .describe() documentation',
          'warning'
        ));
      }
    }

    // Check for z.enum() with many values but no description
    if (line.includes('z.enum([') && line.length > 80) {
      const hasDescribe = line.includes('.describe(') || (lines[index + 1] || '').includes('.describe(');
      if (!hasDescribe) {
        warnings.push(new LintWarning(
          fileName,
          lineNum,
          'Large enum missing .describe() explanation',
          'warning'
        ));
      }
    }

    // Encourage explicit .optional() or .default()
    const fieldPattern = /^\s+\w+:\s*z\./;
    if (fieldPattern.test(line)) {
      const hasOptional = line.includes('.optional()');
      const hasDefault = line.includes('.default(');
      const isRequired = !hasOptional && !hasDefault;
      
      if (isRequired && !line.includes('// required')) {
        // This is just informational, not an error
        // warnings.push(new LintWarning(fileName, lineNum, 'Consider adding // required comment for clarity', 'info'));
      }
    }

    // Check for good examples in comments
    if (line.includes('.describe(') && line.length < 50) {
      warnings.push(new LintWarning(
        fileName,
        lineNum,
        'Description seems short - consider adding usage examples',
        'info'
      ));
    }

    // Discourage 'any' type usage
    if (line.includes(': any') || line.includes('<any>')) {
      warnings.push(new LintWarning(
        fileName,
        lineNum,
        'Avoid "any" type - use specific types for type safety',
        'error'
      ));
    }
  });

  return warnings;
}

async function main() {
  console.log('🔍 Linting Zod contract schemas...\n');

  const files = await readdir(CONTRACT_DIR);
  const tsFiles = files.filter(f => f.endsWith('.ts'));

  let allWarnings = [];
  let errorCount = 0;

  for (const file of tsFiles) {
    const filePath = join(CONTRACT_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const warnings = lintContract(content, file);

    if (warnings.length > 0) {
      allWarnings = allWarnings.concat(warnings);
      errorCount += warnings.filter(w => w.severity === 'error').length;
    }
  }

  if (allWarnings.length > 0) {
    console.log('Contract linting results:\n');
    allWarnings.forEach(w => console.log(w.toString()));
    console.log('');
  }

  if (errorCount > 0) {
    console.error(`❌ Linting failed with ${errorCount} error(s)\n`);
    process.exit(1);
  }

  const warningCount = allWarnings.filter(w => w.severity === 'warning').length;
  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} warning(s) found (not blocking)\n`);
  }

  console.log(`✅ Contract linting passed! (${tsFiles.length} files checked)\n`);
}

main().catch(error => {
  console.error('Linting script failed:', error);
  process.exit(1);
});
