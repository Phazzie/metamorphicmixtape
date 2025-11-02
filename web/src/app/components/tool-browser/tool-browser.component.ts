import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolBrowserService } from '../../services/tool-browser.service';
import { ToolSummary, ToolContractDetail } from '../../models/tool-browser.models';

@Component({
  selector: 'app-tool-browser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-browser.component.html',
  styleUrls: ['./tool-browser.component.scss']
})
export class ToolBrowserComponent implements OnInit {
  private readonly toolBrowserService = inject(ToolBrowserService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly tools = signal<ToolSummary[]>([]);
  readonly selectedTool = signal<ToolSummary | null>(null);
  readonly selectedContract = signal<ToolContractDetail | null>(null);
  readonly hasTools = computed(() => this.tools().length > 0);

  ngOnInit() {
    this.loadTools();
  }

  loadTools() {
    this.loading.set(true);
    this.error.set(null);

    this.toolBrowserService.listTools().subscribe({
      next: (tools) => {
        this.tools.set(tools);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load tools', error);
        this.error.set('Unable to load tool registry.');
        this.loading.set(false);
      }
    });
  }

  viewContract(tool: ToolSummary) {
    this.selectedTool.set(tool);
    this.selectedContract.set(null);

    this.toolBrowserService.getToolContract(tool.name).subscribe({
      next: (contract) => {
        this.selectedContract.set(contract);
      },
      error: (error) => {
        console.error('Failed to load tool contract', error);
        this.error.set('Unable to load tool contract.');
      }
    });
  }
}
