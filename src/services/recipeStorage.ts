import { Recipe } from '../types';

const RECIPES_MAP_KEY = 'recipesMap';
const getRecipeKey = (name: string) => `recipe_${name}`;

/**
 * Helper function to safely parse JSON with a fallback
 */
const safeJSONParse = <T>(data: string | null, fallback: T): T => {
  if (!data) return fallback;
  try {
    return JSON.parse(data) || fallback;
  } catch {
    return fallback;
  }
};

export const recipeStorage = {
  /**
   * Saves a recipe record to localStorage
   */
  saveRecord: async (
    data: Recipe,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Update recipes map with last updated time
      const recipesMap = safeJSONParse<Record<string, string>>(
        localStorage.getItem(RECIPES_MAP_KEY),
        {}
      );
      recipesMap[name] = data.metadata.lastUpdated;
      localStorage.setItem(RECIPES_MAP_KEY, JSON.stringify(recipesMap));

      // Save the recipe data
      localStorage.setItem(getRecipeKey(name), JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Error saving recipe:', error);
      return {
        success: false,
        error: `Failed to save recipe: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },

  /**
   * Lists all saved recipe records
   */
  listRecords: async (): Promise<{
    success: boolean;
    files?: Array<{ name: string; date: string }>;
    error?: string;
  }> => {
    try {
      const recordsMap = safeJSONParse<Record<string, string>>(
        localStorage.getItem(RECIPES_MAP_KEY),
        {}
      );
      const files = Object.entries(recordsMap).map(([name, lastUpdated]) => ({
        name,
        date: lastUpdated,
      }));

      return { success: true, files };
    } catch (error) {
      console.error('Error listing recipes:', error);
      return {
        success: false,
        error: `Failed to list recipes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },

  /**
   * Loads a specific recipe record
   */
  loadRecord: async (name: string): Promise<Recipe | null> => {
    try {
      const data = localStorage.getItem(getRecipeKey(name));
      if (!data) {
        throw new Error('Recipe not found');
      }
      return safeJSONParse<Recipe | null>(data, null);
    } catch (error) {
      console.error('Error loading recipe:', error);
      return null;
    }
  },

  /**
   * Deletes a recipe record
   */
  deleteRecord: async (name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Remove from recipes map
      const recipesMap = safeJSONParse<Record<string, string>>(
        localStorage.getItem(RECIPES_MAP_KEY),
        {}
      );
      delete recipesMap[name];
      localStorage.setItem(RECIPES_MAP_KEY, JSON.stringify(recipesMap));

      // Remove the recipe data
      localStorage.removeItem(getRecipeKey(name));
      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return {
        success: false,
        error: `Failed to delete recipe: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
};