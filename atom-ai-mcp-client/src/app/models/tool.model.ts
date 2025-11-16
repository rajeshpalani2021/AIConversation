export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
  keywords: string[];
  stats: ToolStats;
  schema: ToolSchema;
  examples: string[];
}

export interface ToolStats {
  totalCalls: number;
  successRate: number;
  averageTime: string;
  lastUsed: string;
}

export interface ToolSchema {
  type: string;
  properties: { [key: string]: any };
  required: string[];
}

export interface CategoryFilter {
  name: string;
  active: boolean;
}

export interface SystemStats {
  totalTools: number;
  totalCategories: number;
  totalCalls: number;
  successRate: string;
}
