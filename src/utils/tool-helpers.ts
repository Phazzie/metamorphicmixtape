import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from './logger.js';

/**
 * Tool Helper Utilities
 * 
 * Shared utility functions for common patterns used across MCP tools.
 * These helpers eliminate code duplication and provide centralized error handling.
 */

/**
 * Parse AI response text as JSON with type-safe fallback handling.
 * Extracts JSON from response text, parses it, and returns typed result.
 * On parse failure, logs the error and returns the provided fallback.
 * 
 * @param responseText - Raw text response from AI that should contain JSON
 * @param fallback - Fallback value to return if parsing fails
 * @param toolName - Optional tool name for logging context
 * @returns Parsed JSON object or fallback on error
 * 
 * @example
 * const result = parseToolResponse<LyricsOutput>(
 *   responseText,
 *   { lyrics: responseText, structure: 'Unknown' }
 * );
 */
export function parseToolResponse<T>(
  responseText: string,
  fallback: T,
  toolName?: string
): T {
  try {
    // Extract JSON from response (handles markdown code blocks, extra text, etc.)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn('No JSON found in AI response', undefined, toolName);
      return fallback;
    }
    
    const parsed = JSON.parse(jsonMatch[0]) as T;
    return parsed;
  } catch (error) {
    logger.error(
      'Failed to parse AI response as JSON',
      error as Error,
      { responseText: responseText.substring(0, 200) },
      toolName
    );
    return fallback;
  }
}

/**
 * Create an AI message request with standardized behavior.
 * Wrapper around server.server.createMessage() that provides:
 * - Consistent message formatting
 * - Error handling
 * - Logging
 * - Future: retry logic, telemetry
 * 
 * @param server - MCP server instance
 * @param prompt - The prompt to send to the AI
 * @param maxTokens - Maximum tokens for response (default: 1500)
 * @param toolName - Optional tool name for logging context
 * @returns AI response text content
 * 
 * @example
 * const response = await createAIMessage(
 *   server,
 *   'Generate lyrics about...',
 *   2000,
 *   'generate_lyrics'
 * );
 */
export async function createAIMessage(
  server: McpServer,
  prompt: string,
  maxTokens = 1500,
  toolName?: string
): Promise<string> {
  try {
    logger.debug('Creating AI message', { promptLength: prompt.length, maxTokens }, toolName);
    
    const response = await server.server.createMessage({
      messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
      maxTokens
    });
    
    const responseText = response.content.type === 'text' ? response.content.text : '';
    logger.debug('AI message received', { responseLength: responseText.length }, toolName);
    
    return responseText;
  } catch (error) {
    logger.error('Failed to create AI message', error as Error, undefined, toolName);
    throw error;
  }
}

/**
 * Format tool output into standardized markdown sections with structured content.
 * Provides consistent formatting for tool responses across the MCP server.
 * 
 * @param markdownSections - Array of markdown section strings to combine
 * @param structuredContent - Structured data to include in response
 * @returns Formatted tool response object
 * 
 * @example
 * return formatToolOutput(
 *   [
 *     `# Generated Lyrics\n\n${result.lyrics}`,
 *     `**Structure**: ${result.structure}`
 *   ],
 *   result
 * );
 */
export function formatToolOutput(
  markdownSections: string[],
  structuredContent: { [x: string]: unknown }
): { content: Array<{ type: 'text'; text: string }>; structuredContent: { [x: string]: unknown } } {
  return {
    content: [{
      type: 'text',
      text: markdownSections.filter(Boolean).join('\n\n')
    }],
    structuredContent
  };
}
