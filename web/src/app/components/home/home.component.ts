import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly features = [
    {
      title: 'Songwriting Studio',
      icon: '🎵',
      description: 'Generate original lyrics with AI assistance',
      route: '/songwriting',
      color: '#667eea'
    },
    {
      title: 'Suno Format Tool',
      icon: '🎧',
      description: 'Optimize your lyrics for Suno AI',
      route: '/suno',
      color: '#9f7aea'
    },
    {
      title: 'Tool Browser',
      icon: '🔧',
      description: 'Explore all 16 AI songwriting tools',
      route: '/tools',
      color: '#10b981'
    }
  ];
}
