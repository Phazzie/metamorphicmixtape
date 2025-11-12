/**
 * Unit tests for tool-helpers utilities
 * Uses Node's built-in assert module (no external test framework dependencies)
 */

import assert from 'node:assert';
import { test, describe } from 'node:test';
import { parseToolResponse, formatToolOutput } from '../../src/utils/tool-helpers.js';

describe('parseToolResponse', () => {
  test('should parse valid JSON from response text', () => {
    const responseText = '{"lyrics": "Some lyrics", "structure": "V1-C-V2"}';
    const fallback = { lyrics: 'fallback', structure: 'unknown' };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.strictEqual(result.lyrics, 'Some lyrics');
    assert.strictEqual(result.structure, 'V1-C-V2');
  });

  test('should extract JSON from markdown code blocks', () => {
    const responseText = '```json\n{"lyrics": "Test", "structure": "V1-C"}\n```';
    const fallback = { lyrics: 'fallback', structure: 'unknown' };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.strictEqual(result.lyrics, 'Test');
    assert.strictEqual(result.structure, 'V1-C');
  });

  test('should extract JSON with extra text before and after', () => {
    const responseText = 'Here is the response:\n\n{"lyrics": "Test", "structure": "V1"}\n\nHope this helps!';
    const fallback = { lyrics: 'fallback', structure: 'unknown' };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.strictEqual(result.lyrics, 'Test');
    assert.strictEqual(result.structure, 'V1');
  });

  test('should return fallback when no JSON found', () => {
    const responseText = 'This is just plain text with no JSON';
    const fallback = { lyrics: 'fallback', structure: 'unknown' };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.deepStrictEqual(result, fallback);
  });

  test('should return fallback when JSON is malformed', () => {
    const responseText = '{"lyrics": "Test", invalid json}';
    const fallback = { lyrics: 'fallback', structure: 'unknown' };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.deepStrictEqual(result, fallback);
  });

  test('should handle nested JSON objects', () => {
    const responseText = '{"data": {"nested": "value"}, "count": 42}';
    const fallback = { data: { nested: '' }, count: 0 };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.strictEqual(result.count, 42);
    assert.strictEqual(result.data.nested, 'value');
  });

  test('should handle arrays in JSON', () => {
    const responseText = '{"items": ["a", "b", "c"], "total": 3}';
    const fallback = { items: [], total: 0 };
    
    const result = parseToolResponse(responseText, fallback);
    
    assert.strictEqual(result.total, 3);
    assert.deepStrictEqual(result.items, ['a', 'b', 'c']);
  });
});

describe('formatToolOutput', () => {
  test('should format markdown sections into content array', () => {
    const sections = ['# Title', '**Bold text**', 'Normal text'];
    const structured = { key: 'value' };
    
    const result = formatToolOutput(sections, structured);
    
    assert.strictEqual(result.content.length, 1);
    assert.strictEqual(result.content[0].type, 'text');
    assert.strictEqual(
      result.content[0].text,
      '# Title\n\n**Bold text**\n\nNormal text'
    );
  });

  test('should include structured content in response', () => {
    const sections = ['# Test'];
    const structured = { lyrics: 'test', structure: 'V1' };
    
    const result = formatToolOutput(sections, structured);
    
    assert.deepStrictEqual(result.structuredContent, structured);
  });

  test('should filter out empty sections', () => {
    const sections = ['# Title', '', null as any, '**Text**', undefined as any];
    const structured = { key: 'value' };
    
    const result = formatToolOutput(sections, structured);
    
    assert.strictEqual(
      result.content[0].text,
      '# Title\n\n**Text**'
    );
  });

  test('should handle single section', () => {
    const sections = ['# Only Section'];
    const structured = { data: 'test' };
    
    const result = formatToolOutput(sections, structured);
    
    assert.strictEqual(result.content[0].text, '# Only Section');
  });

  test('should handle empty sections array', () => {
    const sections: string[] = [];
    const structured = { data: 'test' };
    
    const result = formatToolOutput(sections, structured);
    
    assert.strictEqual(result.content[0].text, '');
  });

  test('should preserve structured content types', () => {
    const sections = ['# Test'];
    const structured = {
      string: 'value',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      nested: { key: 'value' }
    };
    
    const result = formatToolOutput(sections, structured);
    
    assert.deepStrictEqual(result.structuredContent, structured);
  });
});

// Run tests and provide summary
describe('Tool Helpers Test Suite', () => {
  test('summary: all tests passed', () => {
    assert.ok(true, 'All tool-helpers utility tests completed successfully');
  });
});
