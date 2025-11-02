/**
 * Tool Browser Models
 * Type-safe interfaces for tool discovery and metadata
 */

export interface ToolSummary {
  name: string;
  title: string;
  description: string;
}

export interface ToolContractDetail {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

export interface ToolsResponse {
  tools: ToolSummary[];
}
