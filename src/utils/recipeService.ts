import { Recipe } from '../types';

interface RecipeAPI {
  saveRecord: (recipe: Recipe, name: string) => Promise<{ success: boolean; error?: string }>;
  loadRecord: (name: string) => Promise<Recipe | null>;
  listRecords: () => Promise<{ success: boolean; files?: { name: string; date: string }[]; error?: string }>;
  deleteRecord: (name: string) => Promise<{ success: boolean; error?: string }>;
}

const STORAGE_KEY_PREFIX = 'sourdough_recipe_';

export const getRecipeAPI = (): RecipeAPI => {
  return {
    saveRecord: async (recipe: Recipe, name: string) => {
      try {
        const key = STORAGE_KEY_PREFIX + name;
        const data = {
          recipe,
          lastModified: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify(data));
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to save recipe'
        };
      }
    },

    loadRecord: async (name: string) => {
      try {
        const key = STORAGE_KEY_PREFIX + name;
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        const parsed = JSON.parse(data);
        // Convert timestamp strings back to Date objects in timeline
        if (parsed.recipe.timeline) {
          parsed.recipe.timeline = parsed.recipe.timeline.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }));
        }
        return parsed.recipe;
      } catch (error) {
        console.error('Error loading recipe:', error);
        return null;
      }
    },

    listRecords: async () => {
      try {
        const recipes: { name: string; date: string }[] = [];
        
        // Iterate through localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(STORAGE_KEY_PREFIX)) {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              const name = key.replace(STORAGE_KEY_PREFIX, '');
              recipes.push({
                name,
                date: parsed.lastModified
              });
            }
          }
        }

        // Sort by date, most recent first
        recipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { 
          success: true, 
          files: recipes 
        };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to list recipes'
        };
      }
    },

    deleteRecord: async (name: string) => {
      try {
        const key = STORAGE_KEY_PREFIX + name;
        localStorage.removeItem(key);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to delete recipe'
        };
      }
    }
  };
};