#!/usr/bin/env node
/**
 * Two-Strike Rule Checker
 * 
 * Checks git history for repeated fixes to the same file/function.
 * Per seam-driven development: after 2 fixes, regenerate from contract.
 * 
 * Looks for commits with keywords: "fix", "bugfix", "patch" targeting
 * the same file 3+ times in recent history.
 */

import { execSync } from 'child_process';

const FIX_KEYWORDS = ['fix', 'bugfix', 'patch', 'repair', 'correct', 'hotfix'];
const RECENT_COMMITS = 50; // Check last 50 commits

function getRecentCommits() {
  try {
    const output = execSync(
      `git log --oneline --name-only -${RECENT_COMMITS}`,
      { encoding: 'utf-8' }
    );
    return output;
  } catch (error) {
    console.error('Failed to get git log:', error.message);
    return '';
  }
}

function parseCommitHistory(logOutput) {
  const lines = logOutput.split('\n').filter(Boolean);
  const commits = [];
  let currentCommit = null;

  for (const line of lines) {
    // Commit line format: "abc1234 commit message"
    if (/^[0-9a-f]{7,}/.test(line)) {
      if (currentCommit) {
        commits.push(currentCommit);
      }
      const [hash, ...messageParts] = line.split(' ');
      currentCommit = {
        hash,
        message: messageParts.join(' '),
        files: []
      };
    } else if (currentCommit) {
      // File line
      currentCommit.files.push(line);
    }
  }

  if (currentCommit) {
    commits.push(currentCommit);
  }

  return commits;
}

function isFix commit(message) {
  const lowerMessage = message.toLowerCase();
  return FIX_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function analyzeFixFrequency(commits) {
  const fileFixCount = new Map();
  const fixCommits = new Map();

  for (const commit of commits) {
    if (isFixCommit(commit.message)) {
      for (const file of commit.files) {
        // Skip test files, configs, and docs
        if (file.includes('test') || file.includes('spec') || 
            file.endsWith('.md') || file.endsWith('.json')) {
          continue;
        }

        if (!fileFixCount.has(file)) {
          fileFixCount.set(file, 0);
          fixCommits.set(file, []);
        }
        fileFixCount.set(file, fileFixCount.get(file) + 1);
        fixCommits.get(file).push(commit);
      }
    }
  }

  return { fileFixCount, fixCommits };
}

function main() {
  console.log('🔍 Checking for two-strike rule violations...\n');
  console.log(`Analyzing last ${RECENT_COMMITS} commits for repeated fixes\n`);

  const logOutput = getRecentCommits();
  if (!logOutput) {
    console.log('⚠️  No git history available (might be shallow clone)\n');
    return;
  }

  const commits = parseCommitHistory(logOutput);
  const { fileFixCount, fixCommits } = analyzeFixFrequency(commits);

  const violations = [];
  for (const [file, count] of fileFixCount.entries()) {
    if (count >= 3) {
      violations.push({ file, count, commits: fixCommits.get(file) });
    }
  }

  if (violations.length === 0) {
    console.log('✅ No two-strike rule violations detected\n');
    return;
  }

  console.warn('⚠️  Possible two-strike rule violations:\n');
  for (const violation of violations) {
    console.warn(`📄 ${violation.file}:`);
    console.warn(`   Fixed ${violation.count} times in recent history`);
    console.warn(`   Commits:`);
    for (const commit of violation.commits.slice(0, 5)) {
      console.warn(`     - ${commit.hash} ${commit.message}`);
    }
    console.warn('');
    console.warn('   ⚠️  Consider: Regenerate from contract instead of patching\n');
  }

  console.log('ℹ️  Two-strike rule: After 2 fixes, regenerate from contract\n');
  console.log('   This is a warning - review whether regeneration is appropriate\n');
}

main();
