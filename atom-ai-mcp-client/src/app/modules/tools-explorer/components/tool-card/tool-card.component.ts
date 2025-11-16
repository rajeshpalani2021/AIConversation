import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tool } from '../../../../models/tool.model';

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-card.component.html',
  styleUrls: ['./tool-card.component.css']
})
export class ToolCardComponent {
  @Input() tool!: Tool;
  @Output() testTool = new EventEmitter<Tool>();
  @Output() viewDetails = new EventEmitter<Tool>();

  onTestClick() {
    this.testTool.emit(this.tool);
  }

  onDetailsClick() {
    this.viewDetails.emit(this.tool);
  }
}
