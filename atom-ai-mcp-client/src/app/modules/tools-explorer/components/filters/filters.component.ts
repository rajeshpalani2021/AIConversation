import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryFilter } from '../../../../models/tool.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  searchTerm = '';

  categories: CategoryFilter[] = [
    { name: 'All Tools', active: true },
    { name: 'Database', active: false },
    { name: 'Analytics', active: false },
    { name: 'Email', active: false },
    { name: 'File System', active: false },
    { name: 'API', active: false },
    { name: 'Reporting', active: false },
    { name: 'Integration', active: false },
    { name: 'Utilities', active: false }
  ];

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchChange.emit(value);
  }

  onCategoryClick(category: CategoryFilter) {
    this.categories.forEach(c => c.active = false);
    category.active = true;
    this.categoryChange.emit(category.name);
  }
}
