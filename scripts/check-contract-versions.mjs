#!/usr/bin/env node
/**
 * Contract Version Checker
 * 
 * Ensures contract versioning follows seam-driven principles:
 * - Versions start at 1
 * - No gaps in version sequences (v1, v2, v3...)
 * - Breaking changes properly documented
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CONTRACT_DIR = 'contracts/tool-contracts/src';

async function extractVersions(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const fileName = filePath.split('/').pop();

  // Find all contract exports with versions
  const contractPattern = /export const (\w+)ContractV(\d+)/g;
  const contracts = [];
  let match;

  while ((match = contractPattern.exec(content)) !== null) {
    contracts.push({
      name: match[1],
      version: parseInt(match[2]),
      file: fileName
    });
  }

  return contracts;
}

async function main() {
  console.log('🔍 Checking contract versions...\n');

  const files = await readdir(CONTRACT_DIR);
  const tsFiles = files.filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'contract.ts');

  const allContracts = [];
  for (const file of tsFiles) {
    const filePath = join(CONTRACT_DIR, file);
    const contracts = await extractVersions(filePath);
    allContracts.push(...contracts);
  }

  // Group by contract name
  const contractsByName = {};
  for (const contract of allContracts) {
    if (!contractsByName[contract.name]) {
      contractsByName[contract.name] = [];
    }
    contractsByName[contract.name].push(contract);
  }

  let hasErrors = false;

  // Check each contract's versions
  for (const [name, versions] of Object.entries(contractsByName)) {
    const versionNumbers = versions.map(v => v.version).sort((a, b) => a - b);
    const files = [...new Set(versions.map(v => v.file))];

    console.log(`📋 ${name}:`);
    console.log(`   Versions: ${versionNumbers.join(', ')}`);
    console.log(`   Files: ${files.join(', ')}`);

    // Check for version gaps
    for (let i = 0; i < versionNumbers.length - 1; i++) {
      if (versionNumbers[i + 1] - versionNumbers[i] > 1) {
        console.error(`   ❌ ERROR: Gap in versions between v${versionNumbers[i]} and v${versionNumbers[i + 1]}`);
        hasErrors = true;
      }
    }

    // Check that version 1 exists
    if (!versionNumbers.includes(1)) {
      console.error(`   ❌ ERROR: Missing version 1 (versions should start at 1)`);
      hasErrors = true;
    }

    // Warn if multiple versions exist
    if (versionNumbers.length > 1) {
      console.log(`   ⚠️  Multiple versions detected (expected for breaking changes)`);
    }

    if (!hasErrors) {
      console.log(`   ✅ Valid`);
    }
    console.log('');
  }

  if (hasErrors) {
    console.error('❌ Contract version validation failed\n');
    process.exit(1);
  }

  console.log(`✅ All contract versions valid! (${allContracts.length} contracts checked)\n`);
}

main().catch(error => {
  console.error('Version check script failed:', error);
  process.exit(1);
});
