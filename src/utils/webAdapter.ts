import type { Recipe } from '../types';

// Web implementation of recipe storage using localStorage
export const recipeAPI = {
  saveRecord: async (data: Recipe, name: string) => {
    try {
      const key = `recipe_${name}`;
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  listRecords: async () => {
    try {
      const files: { name: string; date: string }[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('recipe_')) {
          const name = key.replace('recipe_', '');
          const data = localStorage.getItem(key);
          if (data) {
            const recipe = JSON.parse(data) as Recipe;
            files.push({
              name,
              date: recipe.metadata.lastUpdated,
            });
          }
        }
      }
      return { success: true, files };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  loadRecord: async (name: string) => {
    try {
      const key = `recipe_${name}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as Recipe;
    } catch (error) {
      console.error('Error loading record:', error);
      return null;
    }
  },

  deleteRecord: async (name: string) => {
    try {
      const key = `recipe_${name}`;
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};