import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { initializeContractRegistry } from '../contracts/index.js';
import { logger } from '../utils/logger.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

async function bootstrap() {
  const registry = await initializeContractRegistry();
  const app = express();
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const staticDir = path.resolve(currentDir, '../../public');

  app.use(cors());
  app.use(express.json());
  app.use(express.static(staticDir));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/tools', (_req: Request, res: Response) => {
    const tools = Array.from(registry.tools.values()).map(({ contract }) => ({
      name: contract.name,
      title: contract.title,
      description: contract.description,
      inputSchema: zodToJsonSchema(contract.inputSchema, { target: 'openApi3' }),
      outputSchema: contract.outputSchema
        ? zodToJsonSchema(contract.outputSchema, { target: 'openApi3' })
        : undefined
    }));

    res.json({ tools });
  });

  app.get('/tools/:name', (req: Request, res: Response) => {
    const tool = registry.tools.get(req.params.name);

    if (!tool) {
      res.status(404).json({ error: `Tool ${req.params.name} not found` });
      return;
    }

    res.json({
      name: tool.contract.name,
      title: tool.contract.title,
      description: tool.contract.description,
      inputSchema: zodToJsonSchema(tool.contract.inputSchema, { target: 'openApi3' }),
      outputSchema: tool.contract.outputSchema
        ? zodToJsonSchema(tool.contract.outputSchema, { target: 'openApi3' })
        : undefined
    });
  });

  app.post('/tools/:name/execute', async (req: Request, res: Response) => {
    const tool = registry.tools.get(req.params.name);

    if (!tool) {
      res.status(404).json({ error: `Tool ${req.params.name} not found` });
      return;
    }

    const validation = await tool.contract.inputSchema.safeParseAsync(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid request payload',
        details: validation.error.flatten()
      });
      return;
    }

    try {
      const result = await tool.callback(validation.data);

      if (tool.contract.outputSchema) {
        if (!result?.structuredContent) {
          throw new Error('Tool did not return structured content for validated response');
        }

        const outputValidation = await tool.contract.outputSchema.safeParseAsync(result.structuredContent);

        if (!outputValidation.success) {
          throw new Error(`Invalid structured response: ${outputValidation.error.message}`);
        }
      }

      res.json({
        content: result?.content ?? null,
        structuredContent: result?.structuredContent ?? null,
        isError: result?.isError ?? false
      });
    } catch (error) {
      logger.error('Failed to execute tool via HTTP adapter', error as Error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error executing tool'
      });
    }
  });

  const server = app.listen(PORT, () => {
    logger.info(`Metamorphic Mixtape HTTP adapter listening on port ${PORT}`);
  });

  const shutdown = async () => {
    logger.info('Shutting down HTTP adapter');
    await registry.server.close();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  logger.error('Failed to start HTTP adapter', error as Error);
  process.exit(1);
});

