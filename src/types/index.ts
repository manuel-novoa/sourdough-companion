export interface FlourType {
  id: number;
  name: string;
  percentage: number;
  amount?: number;
}

export interface OtherIngredient {
  id: number;
  name: string;
  weight: number;
}

export interface TimelineEntry {
  id: number;
  timestamp: Date;
  timeDiff: number;
  action: string;
}

export interface RecipeSettings {
  startDateTime: string;
  numDoughballs: number;
  weightPerDoughball: number;
  hydration: number;
  saltPercentage: number;
  starterPercentage: number;
  flourTypes: FlourType[];
  otherIngredients: OtherIngredient[];
}

export interface RecipeResults {
  fermentation: 'under' | 'perfect' | 'over' | '';
  crumbStructure: string;
  crust: string;
  flavorProfile: string;
  notes: string;
}

export interface Recipe {
  metadata: {
    lastUpdated: string;
    recipeName?: string;
  };
  settings: RecipeSettings;
  results: RecipeResults;
  timeline: TimelineEntry[];
}

export interface RecipeAPI {
  saveRecord: (data: Recipe, name: string) => Promise<{ success: boolean; error?: string }>;
  listRecords: () => Promise<{ success: boolean; files?: { name: string; date: string }[]; error?: string }>;
  loadRecord: (name: string) => Promise<Recipe | null>;
  deleteRecord: (name: string) => Promise<{ success: boolean; error?: string }>;
}