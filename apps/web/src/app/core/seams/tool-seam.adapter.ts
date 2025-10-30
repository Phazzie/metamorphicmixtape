import { InjectionToken } from '@angular/core';

export interface ToolSeamAdapter {
  invoke<TInput, TOutput>(contractName: string, payload: TInput): Promise<TOutput>;
}

export const TOOL_SEAM_ADAPTER = new InjectionToken<ToolSeamAdapter>('TOOL_SEAM_ADAPTER');
export const TOOL_SEAM_BASE_URL = new InjectionToken<string>('TOOL_SEAM_BASE_URL');
