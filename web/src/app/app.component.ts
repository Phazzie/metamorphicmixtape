import { Component, computed, effect, signal } from '@angular/core';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ToolContractView {
  name: string;
  title: string;
  description: string;
}

@Component({
  selector: 'metamorphic-root',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = 'Metamorphic Mixtape Tools';
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly tools = signal<ToolContractView[]>([]);
  readonly selectedTool = signal<ToolContractView | null>(null);
  readonly selectedContract = signal<any>(null);

  constructor(private readonly http: HttpClient) {
    effect(() => {
      void this.loadTools();
    });
  }

  readonly hasTools = computed(() => this.tools().length > 0);

  async loadTools() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await this.http
        .get<{ tools: ToolContractView[] }>('/tools')
        .toPromise();

      this.tools.set(response?.tools ?? []);
    } catch (error) {
      console.error('Failed to load tools', error);
      this.error.set('Unable to load tool registry.');
    } finally {
      this.loading.set(false);
    }
  }

  async viewContract(tool: ToolContractView) {
    this.selectedTool.set(tool);
    this.selectedContract.set(null);

    try {
      const response = await this.http.get(`/tools/${tool.name}`).toPromise();
      this.selectedContract.set(response);
    } catch (error) {
      console.error('Failed to load tool contract', error);
      this.error.set('Unable to load tool contract.');
    }
  }
}
