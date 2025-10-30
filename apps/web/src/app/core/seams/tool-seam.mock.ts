import { ToolSeamAdapter } from './tool-seam.adapter.js';

export class MockToolSeamAdapter implements ToolSeamAdapter {
  public readonly calls: Array<{ contract: string; payload: unknown }> = [];
  public response: unknown = {};

  async invoke<TInput, TOutput>(contractName: string, payload: TInput): Promise<TOutput> {
    this.calls.push({ contract: contractName, payload });
    return this.response as TOutput;
  }
}
