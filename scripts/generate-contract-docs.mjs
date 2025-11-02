#!/usr/bin/env node
/**
 * Contract Documentation Generator
 * 
 * Generates markdown documentation from Zod contracts
 * for PR comments and reviews.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CONTRACT_DIR = 'contracts/tool-contracts/src';

async function extractContractInfo(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const fileName = filePath.split('/').pop();
  
  if (fileName === 'index.ts' || fileName === 'contract.ts') {
    return null;
  }

  const contracts = [];
  
  // Extract contract exports
  const contractPattern = /export const (\w+ContractV(\d+)) = \{[\s\S]*?name: ['"]([^'"]+)['"][\s\S]*?\}/g;
  let match;

  while ((match = contractPattern.exec(content)) !== null) {
    const [, fullName, version, toolName] = match;
    
    // Extract description if present
    let description = 'No description';
    const descPattern = new RegExp(`${fullName}[\\s\\S]*?description:\\s*['"]([^'"]+)['"]`);
    const descMatch = content.match(descPattern);
    if (descMatch) {
      description = descMatch[1];
    }

    contracts.push({
      fullName,
      toolName,
      version: parseInt(version),
      description,
      category: fileName.replace('.ts', '')
    });
  }

  return contracts;
}

async function main() {
  const files = await readdir(CONTRACT_DIR);
  const tsFiles = files.filter(f => f.endsWith('.ts'));

  const allContracts = [];
  for (const file of tsFiles) {
    const filePath = join(CONTRACT_DIR, file);
    const contracts = await extractContractInfo(filePath);
    if (contracts) {
      allContracts.push(...contracts);
    }
  }

  if (allContracts.length === 0) {
    console.log('No changes detected in contracts.');
    return;
  }

  // Group by category
  const byCategory = {};
  for (const contract of allContracts) {
    if (!byCategory[contract.category]) {
      byCategory[contract.category] = [];
    }
    byCategory[contract.category].push(contract);
  }

  // Generate markdown
  console.log('### Contract Overview\n');
  console.log(`Total contracts: **${allContracts.length}**\n`);

  for (const [category, contracts] of Object.entries(byCategory)) {
    console.log(`#### ${category.charAt(0).toUpperCase() + category.slice(1)} (${contracts.length} contracts)\n`);
    
    for (const contract of contracts) {
      console.log(`- **\`${contract.toolName}\`** (v${contract.version})`);
      if (contract.description !== 'No description') {
        console.log(`  - ${contract.description}`);
      }
    }
    console.log('');
  }

  console.log('---\n');
  console.log('*All contracts follow seam-driven development principles with versioning support.*');
}

main().catch(error => {
  console.error('Documentation generation failed:', error);
  process.exit(1);
});
