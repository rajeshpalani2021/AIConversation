import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard', active: false },
    { icon: '💬', label: 'Conversations', route: '/conversations', active: false },
    { icon: '⚙️', label: 'Workflows', route: '/workflows', active: false },
    { icon: '🔧', label: 'Tools Explorer', route: '/tools', active: true },
    { icon: '🎮', label: 'API Playground', route: '/playground', active: false },
    { icon: '⚙️', label: 'Settings', route: '/settings', active: false }
  ];

  onNavItemClick(item: NavItem) {
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }
}
