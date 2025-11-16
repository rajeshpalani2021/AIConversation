import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStats } from '../../../../models/tool.model';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.css']
})
export class StatsBarComponent {
  @Input() stats: SystemStats = {
    totalTools: 0,
    totalCategories: 0,
    totalCalls: 0,
    successRate: '0%'
  };
}
