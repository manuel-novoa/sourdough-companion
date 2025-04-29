export interface FlourType {
  id: number;
  name: string;
  percentage: number;
  isFixed?: boolean;
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

export interface Recipe {
  metadata: {
    lastUpdated: string;
    recipeName?: string;
  };
  settings: {
    startDateTime: string;
    numDoughballs: number;
    weightPerDoughball: number;
    hydration: number;
    saltPercentage: number;
    starterPercentage: number;
    flourTypes: FlourType[];
    otherIngredients: OtherIngredient[];
  };
  results: {
    fermentation: string;
    crumbStructure: string;
    crust: string;
    flavorProfile: string;
    notes: string;
  };
  timeline: TimelineEntry[];
}