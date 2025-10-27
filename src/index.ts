#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerSongwritingTools } from './tools/songwriting.js';
import { registerAnalysisTools } from './tools/analysis.js';
import { registerMetaTools } from './tools/meta.js';
import { registerSunoTools } from './tools/suno.js';
import { registerCollaborationTools } from './tools/collaboration.js';
import { logger } from './utils/logger.js';

/**
 * Skeptical Wombat's Metamorphic Mixtape
 * AI-Powered Songwriting Assistant
 * 
 * This server provides intelligent tools for songwriting workflows with Suno AI,
 * focusing on AI-powered approaches over heuristics for maximum creativity.
 */

async function main() {
  try {
    logger.info('Starting Metamorphic Mixtape MCP Server...');
    
    const server = new McpServer({
      name: 'metamorphic-mixtape',
      version: '1.0.0'
    });

    // Register all tool categories
    logger.info('Registering tools...');
    await registerSongwritingTools(server);
    await registerAnalysisTools(server);
    await registerMetaTools(server);
    await registerSunoTools(server);
    await registerCollaborationTools(server);
    logger.info('All tools registered successfully');

    // Connect to stdio transport for VS Code/Claude Desktop
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info('Metamorphic Mixtape MCP Server running on stdio');
    console.error('Metamorphic Mixtape MCP Server running on stdio');
  } catch (error) {
    logger.error('Failed to start server', error as Error);
    throw error;
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  console.error('Shutting down Metamorphic Mixtape MCP Server');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', reason as Error, { promise: String(promise) });
  process.exit(1);
});

// Start the server
main().catch((error) => {
  logger.error('Failed to start Metamorphic Mixtape MCP Server', error);
  console.error('Failed to start Metamorphic Mixtape MCP Server:', error);
  process.exit(1);
});