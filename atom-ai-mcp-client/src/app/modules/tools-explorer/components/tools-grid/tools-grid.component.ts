import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tool } from '../../../../models/tool.model';
import { ToolCardComponent } from '../tool-card/tool-card.component';

@Component({
  selector: 'app-tools-grid',
  standalone: true,
  imports: [CommonModule, ToolCardComponent],
  templateUrl: './tools-grid.component.html',
  styleUrls: ['./tools-grid.component.css']
})
export class ToolsGridComponent {
  @Input() tools: Tool[] = [];
  @Output() testTool = new EventEmitter<Tool>();
  @Output() viewDetails = new EventEmitter<Tool>();

  onTestTool(tool: Tool) {
    this.testTool.emit(tool);
  }

  onViewDetails(tool: Tool) {
    this.viewDetails.emit(tool);
  }

  trackByToolId(index: number, tool: Tool): string {
    return tool.id;
  }
}
