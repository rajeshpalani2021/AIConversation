import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tools',
    pathMatch: 'full'
  },
  {
    path: 'tools',
    loadComponent: () => import('./modules/tools-explorer/tools-explorer.component').then(m => m.ToolsExplorerComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/tools-explorer/tools-explorer.component').then(m => m.ToolsExplorerComponent) // Placeholder
  },
  {
    path: 'conversations',
    loadComponent: () => import('./modules/tools-explorer/tools-explorer.component').then(m => m.ToolsExplorerComponent) // Placeholder
  },
  {
    path: 'workflows',
    loadComponent: () => import('./modules/tools-explorer/tools-explorer.component').then(m => m.ToolsExplorerComponent) // Placeholder
  },
  {
    path: 'playground',
    loadComponent: () => import('./modules/tools-explorer/tools-explorer.component').then(m => m.ToolsExplorerComponent) // Placeholder
  },
  {
    path: 'settings',
    loadComponent: () => import('./modules/tools-explorer/tools-explorer.component').then(m => m.ToolsExplorerComponent) // Placeholder
  }
];
