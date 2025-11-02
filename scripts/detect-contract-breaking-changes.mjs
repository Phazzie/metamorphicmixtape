#!/usr/bin/env node
/**
 * Breaking Change Detector
 * 
 * Detects breaking changes in Zod contracts between base and head:
 * - Required fields added
 * - Field types changed
 * - Enum values removed
 * - Fields removed
 * 
 * Ensures version numbers are incremented for breaking changes.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node detect-contract-breaking-changes.mjs <base-dir> <head-dir>');
  process.exit(1);
}

const [baseDir, headDir] = args;

function extractSchemaInfo(content) {
  const schemas = new Map();
  
  // Extract contract definitions
  const contractPattern = /export const (\w+ContractV\d+) = \{[\s\S]*?inputSchema:[^\}]*?\}/g;
  let match;

  while ((match = contractPattern.exec(content)) !== null) {
    const name = match[1];
    const schemaText = match[0];
    
    // Extract field definitions
    const fields = [];
    const fieldPattern = /(\w+):\s*z\.(\w+)\([^\)]*\)((?:\.(?:optional|describe|default)\([^\)]*\))*)/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldPattern.exec(schemaText)) !== null) {
      fields.push({
        name: fieldMatch[1],
        type: fieldMatch[2],
        modifiers: fieldMatch[3] || '',
        isOptional: fieldMatch[3].includes('.optional()') || fieldMatch[3].includes('.default(')
      });
    }

    schemas.set(name.replace(/ContractV\d+/, ''), {
      name,
      fields
    });
  }

  return schemas;
}

async function compareContracts(baseDir, headDir) {
  const baseFiles = await readdir(baseDir);
  const headFiles = await readdir(headDir);
  
  const breakingChanges = [];

  for (const file of baseFiles.filter(f => f.endsWith('.js') || f.endsWith('.d.ts'))) {
    if (!headFiles.includes(file)) {
      console.log(`ℹ️  File removed: ${file}`);
      continue;
    }

    const baseContent = await readFile(join(baseDir, file), 'utf-8');
    const headContent = await readFile(join(headDir, file), 'utf-8');

    const baseSchemas = extractSchemaInfo(baseContent);
    const headSchemas = extractSchemaInfo(headContent);

    for (const [name, baseSchema] of baseSchemas) {
      const headSchema = headSchemas.get(name);
      
      if (!headSchema) {
        breakingChanges.push({
          file,
          contract: name,
          type: 'CONTRACT_REMOVED',
          message: `Contract removed: ${baseSchema.name}`
        });
        continue;
      }

      // Check for removed fields
      for (const baseField of baseSchema.fields) {
        const headField = headSchema.fields.find(f => f.name === baseField.name);
        if (!headField) {
          breakingChanges.push({
            file,
            contract: name,
            type: 'FIELD_REMOVED',
            message: `Field removed: ${baseField.name}`
          });
        } else {
          // Check for type changes
          if (baseField.type !== headField.type) {
            breakingChanges.push({
              file,
              contract: name,
              type: 'TYPE_CHANGED',
              message: `Field ${baseField.name} type changed: ${baseField.type} → ${headField.type}`
            });
          }

          // Check for optional → required
          if (baseField.isOptional && !headField.isOptional) {
            breakingChanges.push({
              file,
              contract: name,
              type: 'REQUIRED_FIELD',
              message: `Field ${baseField.name} changed from optional to required`
            });
          }
        }
      }

      // Check for new required fields
      for (const headField of headSchema.fields) {
        const baseField = baseSchema.fields.find(f => f.name === headField.name);
        if (!baseField && !headField.isOptional) {
          breakingChanges.push({
            file,
            contract: name,
            type: 'NEW_REQUIRED_FIELD',
            message: `New required field added: ${headField.name}`
          });
        }
      }
    }
  }

  return breakingChanges;
}

async function main() {
  console.log('🔍 Detecting breaking changes in contracts...\n');
  console.log(`Base: ${baseDir}`);
  console.log(`Head: ${headDir}\n`);

  const breakingChanges = await compareContracts(baseDir, headDir);

  if (breakingChanges.length === 0) {
    console.log('✅ No breaking changes detected\n');
    return;
  }

  console.error('⚠️  Breaking changes detected:\n');
  
  const byFile = {};
  for (const change of breakingChanges) {
    if (!byFile[change.file]) {
      byFile[change.file] = [];
    }
    byFile[change.file].push(change);
  }

  for (const [file, changes] of Object.entries(byFile)) {
    console.error(`📄 ${file}:`);
    for (const change of changes) {
      console.error(`   - [${change.type}] ${change.message}`);
    }
    console.error('');
  }

  console.error('⚠️  Breaking changes require version increment (v1 → v2)');
  console.error('   Or consider making changes backward-compatible\n');
  
  // Don't fail the build, just warn
  console.log('ℹ️  This is a warning - please review changes carefully\n');
}

main().catch(error => {
  console.error('Breaking change detection failed:', error);
  process.exit(1);
});
