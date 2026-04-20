import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from './logger.js';

/**
 * Parse AI response text as JSON with fallback handling.
 */
export function parseToolResponse<T>(
  responseText: string,
  fallback: T,
  toolName?: string
): T {
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn('No JSON found in AI response', undefined, toolName);
      return fallback;
    }
    return JSON.parse(jsonMatch[0]) as T;
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
