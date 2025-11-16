import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tool } from '../../../../models/tool.model';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-panel.component.html',
  styleUrls: ['./detail-panel.component.css']
})
export class DetailPanelComponent {
  @Input() tool: Tool | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() executeTool = new EventEmitter<{ tool: Tool; parameters: any }>();

  testParameters = '';

  onClose() {
    this.close.emit();
  }

  onExecute() {
    try {
      const parameters = JSON.parse(this.testParameters);
      if (this.tool) {
        this.executeTool.emit({ tool: this.tool, parameters });
      }
    } catch (error) {
      alert('Invalid JSON parameters');
    }
  }

  getSchemaString(): string {
    if (!this.tool) return '';
    return JSON.stringify(this.tool.schema, null, 2);
  }
}
