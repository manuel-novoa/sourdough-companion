import { useState, useCallback } from 'react';
import { Recipe } from '../types';
import { recipeStorage } from '../services/recipeStorage';
import { useRecipe, useRecipeActions } from '../store/recipeContext';

export const useRecipeStorage = () => {
  const { state } = useRecipe();
  const { setRecipe, resetState } = useRecipeActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveRecipe = useCallback(
    async (name: string, isUpdate = false) => {
      if (!state.currentRecipe) {
        setError('No recipe to save');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await recipeStorage.saveRecord(state.currentRecipe, name);
        if (result.success) {
          setRecipe(state.currentRecipe, name);
          return true;
        } else {
          throw new Error(result.error || 'Failed to save recipe');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save recipe');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [state.currentRecipe, setRecipe]
  );

  const loadRecipe = useCallback(
    async (name: string) => {
      setLoading(true);
      setError(null);

      try {
        const recipe = await recipeStorage.loadRecord(name);
        if (recipe) {
          setRecipe(recipe, name);
          return true;
        } else {
          throw new Error('Recipe not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipe');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setRecipe]
  );

  const deleteRecipe = useCallback(
    async (name: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await recipeStorage.deleteRecord(name);
        if (result.success) {
          if (state.currentRecipeName === name) {
            resetState();
          }
          return true;
        } else {
          throw new Error(result.error || 'Failed to delete recipe');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete recipe');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [state.currentRecipeName, resetState]
  );

  const listRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await recipeStorage.listRecords();
      if (result.success && result.files) {
        return result.files;
      } else {
        throw new Error(result.error || 'Failed to list recipes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list recipes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveRecipe,
    loadRecipe,
    deleteRecipe,
    listRecipes,
    loading,
    error,
  };
};