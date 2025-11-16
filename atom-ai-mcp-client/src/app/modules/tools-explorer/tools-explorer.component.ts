import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Tool, SystemStats } from '../../models/tool.model';
import { ToolsService } from '../../services/tools.service';

import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ToolsGridComponent } from './components/tools-grid/tools-grid.component';
import { DetailPanelComponent } from './components/detail-panel/detail-panel.component';

@Component({
  selector: 'app-tools-explorer',
  standalone: true,
  imports: [
    CommonModule,
    StatsBarComponent,
    FiltersComponent,
    ToolsGridComponent,
    DetailPanelComponent
  ],
  templateUrl: './tools-explorer.component.html',
  styleUrls: ['./tools-explorer.component.css']
})
export class ToolsExplorerComponent implements OnInit, OnDestroy {
  tools: Tool[] = [];
  filteredTools: Tool[] = [];
  systemStats: SystemStats = {
    totalTools: 0,
    totalCategories: 0,
    totalCalls: 0,
    successRate: '0%'
  };

  selectedTool: Tool | null = null;
  isDetailPanelOpen = false;

  private streamSubscription?: Subscription;

  constructor(private toolsService: ToolsService) {}

  ngOnInit() {
    this.loadSystemStats();
    this.startStreaming();
  }

  ngOnDestroy() {
    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }
  }

  /**
   * Load system statistics
   */
  loadSystemStats() {
    this.toolsService.getSystemStats().subscribe(stats => {
      this.systemStats = stats;
    });
  }

  /**
   * Start streaming tools from the backend
   * This demonstrates real-time UI updates as data arrives
   */
  startStreaming() {
    this.streamSubscription = this.toolsService.streamTools().subscribe({
      next: (tool: Tool) => {
        // Add the tool to the list as it arrives
        this.tools.push(tool);
        this.filteredTools = [...this.tools];
        console.log('Received tool:', tool.name);
      },
      error: (error) => {
        console.error('Error streaming tools:', error);
      },
      complete: () => {
        console.log('Streaming complete. Total tools received:', this.tools.length);
      }
    });
  }

  /**
   * Handle search filter
   */
  onSearchChange(searchTerm: string) {
    this.filterTools(searchTerm, null);
  }

  /**
   * Handle category filter
   */
  onCategoryChange(category: string) {
    this.filterTools(null, category);
  }

  /**
   * Filter tools based on search and category
   */
  private filterTools(searchTerm: string | null, category: string | null) {
    let filtered = [...this.tools];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.keywords.some(k => k.toLowerCase().includes(term))
      );
    }

    if (category && category !== 'All Tools') {
      filtered = filtered.filter(tool =>
        tool.categories.includes(category)
      );
    }

    this.filteredTools = filtered;
  }

  /**
   * Handle discover tools button click
   */
  onDiscoverTools() {
    // Restart streaming or refresh data
    this.tools = [];
    this.filteredTools = [];
    this.startStreaming();
  }

  /**
   * Handle test tool action
   */
  onTestTool(tool: Tool) {
    console.log('Testing tool:', tool.name);
    alert(`Testing tool: ${tool.name}\n\nThis would open a test interface for the tool.`);
  }

  /**
   * Handle view details action
   */
  onViewDetails(tool: Tool) {
    this.selectedTool = tool;
    this.isDetailPanelOpen = true;
  }

  /**
   * Close detail panel
   */
  onCloseDetailPanel() {
    this.isDetailPanelOpen = false;
    setTimeout(() => {
      this.selectedTool = null;
    }, 300); // Wait for animation to complete
  }

  /**
   * Execute a tool with parameters
   */
  onExecuteTool(event: { tool: Tool; parameters: any }) {
    console.log('Executing tool:', event.tool.name, 'with parameters:', event.parameters);
    this.toolsService.executeTool(event.tool.id, event.parameters).subscribe({
      next: (result) => {
        alert(`Tool executed successfully!\n\nResult: ${JSON.stringify(result, null, 2)}`);
      },
      error: (error) => {
        alert(`Error executing tool: ${error.message}`);
      }
    });
  }
}
