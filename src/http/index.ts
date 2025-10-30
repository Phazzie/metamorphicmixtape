import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { executeTool, getToolContract, listToolContracts } from '../contracts/index.js';
import type { RuntimeToolContract } from '../contracts/types.js';
import { logger } from '../utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
const staticDir = path.resolve(process.cwd(), 'public');

const toContractResponse = (contract: RuntimeToolContract) => ({
  name: contract.name,
  title: contract.title,
  description: contract.description,
  annotations: contract.annotations,
  inputSchema: zodToJsonSchema(contract.inputSchema, { strictUnions: true }),
  outputSchema: contract.outputSchema ? zodToJsonSchema(contract.outputSchema, { strictUnions: true }) : undefined
});

app.get('/health', (_req: any, res: any) => {
  res.json({ status: 'ok' });
});

app.get('/tools', async (_req: any, res: any, next: any) => {
  try {
    const contracts = await listToolContracts();
    res.json(contracts.map(toContractResponse));
  } catch (error) {
    next(error);
  }
});

app.get('/tools/:name', async (req: any, res: any, next: any) => {
  try {
    const contract = await getToolContract(req.params.name);
    if (!contract) {
      res.status(404).json({ error: `Tool ${req.params.name} not found` });
      return;
    }
    res.json(toContractResponse(contract));
  } catch (error) {
    next(error);
  }
});

app.post('/tools/:name/execute', async (req: any, res: any, next: any) => {
  try {
    const contract = await getToolContract(req.params.name);
    if (!contract) {
      res.status(404).json({ error: `Tool ${req.params.name} not found` });
      return;
    }

    let parsedInput;
    try {
      parsedInput = await contract.inputSchema.parseAsync(req.body ?? {});
    } catch (validationError: unknown) {
      res.status(400).json({
        error: 'Invalid tool input',
        details: validationError instanceof Error ? validationError.message : validationError
      });
      return;
    }

    const result = await executeTool(contract.name, parsedInput);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(staticDir));

app.get('*', (req: any, res: any, next: any) => {
  if (req.path.startsWith('/tools') || req.path.startsWith('/health')) {
    next();
    return;
  }

  res.sendFile(path.join(staticDir, 'index.html'), (error: any) => {
    if (error) {
      next(error);
    }
  });
});

app.use((error: unknown, _req: any, res: any, _next: any) => {
  logger.error('HTTP adapter error', error as Error);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.listen(port, () => {
  logger.info(`HTTP adapter listening on port ${port}`);
});
