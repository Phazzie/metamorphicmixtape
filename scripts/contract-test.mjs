import { initializeContractRegistry } from '../dist/contracts/index.js';

async function main() {
  const registry = await initializeContractRegistry();

  if (registry.tools.size === 0) {
    throw new Error('No tool contracts were registered.');
  }

  for (const [name, tool] of registry.tools.entries()) {
    if (!tool.contract.inputSchema) {
      throw new Error(`Tool ${name} is missing an input schema.`);
    }

    if (typeof tool.callback !== 'function') {
      throw new Error(`Tool ${name} does not expose a callable handler.`);
    }
  }

  console.log(`Validated ${registry.tools.size} tool contracts.`);
  await registry.server.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
