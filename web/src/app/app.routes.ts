import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SongwritingStudioComponent } from './components/songwriting-studio/songwriting-studio.component';
import { SunoFormatComponent } from './components/suno-format/suno-format.component';
import { ToolBrowserComponent } from './components/tool-browser/tool-browser.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'songwriting', component: SongwritingStudioComponent },
  { path: 'suno', component: SunoFormatComponent },
  { path: 'tools', component: ToolBrowserComponent },
  { path: '**', redirectTo: '' }
];
