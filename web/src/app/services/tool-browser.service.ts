import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToolSummary, ToolContractDetail, ToolsResponse } from '../models/tool-browser.models';

/**
 * ToolBrowserService - Tool Registry and Metadata Browsing Seam
 * 
 * @seam ToolBrowserSeam
 * @contract ../contracts/ToolBrowserSeam.contract.v1.yml
 * @version 1
 * 
 * This service implements the ToolBrowserSeam contract, providing access to:
 * - list_tools: Get all available tools from registry
 * - get_tool_contract: Get detailed contract for specific tool
 * 
 * This seam provides tool discovery and metadata functionality.
 * Unlike execution seams, this only retrieves tool information.
 * 
 * See contract for: inputs, outputs, errors, examples, validation
 */

@Injectable({
  providedIn: 'root'
})
export class ToolBrowserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * List all available tools from the registry
   * @returns Observable of tool summaries
   */
  listTools(): Observable<ToolSummary[]> {
    const url = `${this.baseUrl}/tools`;
    return this.http.get<ToolsResponse>(url).pipe(
      map(response => response.tools)
    );
  }

  /**
   * Get detailed contract for a specific tool
   * @param toolName Name of the tool
   * @returns Observable of tool contract details
   */
  getToolContract(toolName: string): Observable<ToolContractDetail> {
    const url = `${this.baseUrl}/tools/${toolName}`;
    return this.http.get<ToolContractDetail>(url);
  }
}
