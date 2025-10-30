import { listToolContracts } from '../contracts/index.js';

export async function validateContracts(): Promise<void> {
  const contracts = await listToolContracts();

  if (!contracts.length) {
    throw new Error('No tool contracts were discovered.');
  }

  const names = new Set<string>();
  for (const contract of contracts) {
    if (names.has(contract.name)) {
      throw new Error(`Duplicate contract detected for tool ${contract.name}`);
    }
    names.add(contract.name);

    if (typeof contract.inputSchema?.parse !== 'function') {
      throw new Error(`Tool ${contract.name} is missing a valid input schema.`);
    }
  }

  console.log(`Validated ${contracts.length} tool contract(s).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateContracts().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
