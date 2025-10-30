import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

interface ToolContractSummary {
  name: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly tools = signal<ToolContractSummary[]>([]);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.loadContracts();
  }

  private loadContracts(): void {
    this.http.get<ToolContractSummary[]>('/tools').subscribe({
      next: (contracts) => {
        this.tools.set(contracts);
        this.error.set(null);
      },
      error: () => {
        this.error.set('Unable to load tool contracts from the adapter.');
      }
    });
  }
}
