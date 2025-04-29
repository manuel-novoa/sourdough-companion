import React, { useState } from 'react';
import { useRecipe, useRecipeActions } from '../store/recipeContext';
import { getRecipeAPI } from '../utils/recipeService';
import { useRecipePDF } from '../hooks/useRecipePDF';
import type { Recipe } from '../types';

const RecipeStorageHeader: React.FC = () => {
  const { state } = useRecipe();
  const { setRecipe, resetState, clearChanges } = useRecipeActions();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<{ name: string; date: string }[]>([]);
  const { generatePDF } = useRecipePDF(state.currentRecipe!);

  const recipeAPI = getRecipeAPI();

  const handleNew = () => {
    if (state.hasUnsavedChanges && !state.currentRecipeName) {
      // If there are unsaved changes and no current recipe,
      // prompt for name instead of resetting
      setShowSaveDialog(true);
    } else {
      // Just show the dialog, we'll reset state only after confirmation
      setShowSaveDialog(true);
      setNewRecipeName('');
    }
  };

  const handleSave = async (asNew: boolean = false) => {
    if (!state.currentRecipe) return;

    try {
      const name = asNew ? newRecipeName : state.currentRecipeName;
      
      if (!name) {
        setShowSaveDialog(true);
        return;
      }

      const recipeToSave = {
        ...state.currentRecipe,
        metadata: {
          ...state.currentRecipe.metadata,
          lastUpdated: new Date().toLocaleString(),
          recipeName: name
        }
      };

      const result = await recipeAPI.saveRecord(recipeToSave, name);
      
      if (result.success) {
        // If this was triggered by "New Recipe", reset the state after successful save
        if (asNew && state.currentRecipeName) {
          resetState();
        }
        setRecipe(recipeToSave, name);
        clearChanges();
        setShowSaveDialog(false);
        setNewRecipeName('');
        setError(null);
      } else {
        setError(result.error || 'Failed to save recipe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    }
  };

  const handleSaveDialogClose = () => {
    setShowSaveDialog(false);
    setNewRecipeName('');
    setError(null);
  };

  const handleLoadClick = async () => {
    try {
      const result = await recipeAPI.listRecords();
      if (result.success && result.files) {
        setRecipes(result.files);
        setShowLoadDialog(true);
        setError(null);
      } else {
        setError(result.error || 'Failed to list recipes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list recipes');
    }
  };

  const handleLoadRecipe = async (name: string) => {
    try {
      const recipe = await recipeAPI.loadRecord(name);
      if (recipe) {
        setRecipe(recipe as Recipe, name);
        setShowLoadDialog(false);
        setError(null);
      } else {
        setError('Failed to load recipe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    }
  };

  const handleDeleteRecipe = async (name: string) => {
    try {
      const result = await recipeAPI.deleteRecord(name);
      if (result.success) {
        const listResult = await recipeAPI.listRecords();
        if (listResult.success && listResult.files) {
          setRecipes(listResult.files);
        }
        if (state.currentRecipeName === name) {
          resetState();
        }
        setShowDeleteConfirm(null);
        setError(null);
      } else {
        setError(result.error || 'Failed to delete recipe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-6 border-b border-bread-100 pb-4">
      <div className="flex justify-between items-center">
        {/* Status Indicators */}
        <div>
          {state.currentRecipe ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-bread-700 text-base font-medium">
                  {state.currentRecipeName}
                </span>
                {state.hasUnsavedChanges && state.currentRecipeName !== null && (
                  <span className="text-amber-600 text-sm font-medium flex items-center bg-amber-50/50 px-2 py-0.5 rounded-full">
                    <i className="ph-thin ph-warning-circle mr-1"></i>
                    Unsaved Changes
                  </span>
                )}
              </div>
              {state.currentRecipe?.metadata.recipeName && (
                <span className="text-bread-500 text-sm">
                  Last modified: {formatDate(state.currentRecipe.metadata.lastUpdated)}
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-bread-500 text-sm">
                Unsaved recipe
              </span>
              {state.hasUnsavedChanges && (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="text-bread-600 hover:text-bread-800 text-sm font-medium flex items-center bg-bread-50/50 px-3 py-1 rounded-full transition-colors"
                >
                  <i className="ph-thin ph-floppy-disk mr-1"></i>
                  Save Recipe
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
          <button
            onClick={handleNew}
            className="text-bread-600 hover:text-bread-800 transition-colors"
            title="New Recipe"
          >
            <i className="ph-thin ph-file-plus text-2xl"></i>
          </button>

          <button
            onClick={handleLoadClick}
            className="text-bread-600 hover:text-bread-800 transition-colors"
            title="Load Recipe"
          >
            <i className="ph-thin ph-folder-open text-2xl"></i>
          </button>

          {state.currentRecipeName && (
            <button
              onClick={() => handleSave(false)}
              className="text-bread-600 hover:text-bread-800 transition-colors"
              title="Save Recipe"
            >
              <i className="ph-thin ph-floppy-disk text-2xl"></i>
            </button>
          )}
          
          <button
            onClick={() => setShowSaveDialog(true)}
            className="text-bread-600 hover:text-bread-800 transition-colors"
            title="Save As New"
          >
            <i className="ph-thin ph-floppy-disk-plus text-2xl"></i>
          </button>

          {state.currentRecipe && (
            <button
              onClick={generatePDF}
              className="text-bread-600 hover:text-bread-800 transition-colors"
              title="Export as PDF"
            >
              <i className="ph-thin ph-file-pdf text-2xl"></i>
            </button>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {state.currentRecipeName ? 'Save Recipe As' : 'Name Your Recipe'}
            </h3>
            {error && (
              <div className="text-red-600 mb-4 text-sm">
                {error}
              </div>
            )}
            <input
              type="text"
              value={newRecipeName}
              onChange={(e) => setNewRecipeName(e.target.value)}
              placeholder="Enter recipe name"
              className="w-full p-2 border rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSaveDialogClose}
                className="px-4 py-2 text-bread-600 hover:text-bread-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={!newRecipeName}
                className="bg-bread-500 text-white px-4 py-2 rounded hover:bg-bread-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Load Recipe</h3>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="text-bread-600 hover:text-bread-800"
              >
                <i className="ph-thin ph-x text-2xl"></i>
              </button>
            </div>
            {error && (
              <div className="text-red-600 mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="max-h-96 overflow-y-auto">
              {recipes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No saved recipes found</p>
              ) : (
                <div className="space-y-2">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.name}
                      className="flex items-center justify-between p-3 hover:bg-bread-50 rounded-lg transition-colors group"
                    >
                      <button
                        onClick={() => handleLoadRecipe(recipe.name)}
                        className="flex-1 text-left flex justify-between items-center"
                      >
                        <span className="font-medium text-bread-800">{recipe.name}</span>
                        <span className="text-sm text-bread-500">
                          {formatDate(recipe.date)}
                        </span>
                      </button>
                      
                      {showDeleteConfirm === recipe.name ? (
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleDeleteRecipe(recipe.name)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-bread-600 hover:text-bread-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(recipe.name)}
                          className="ml-4 text-bread-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Recipe"
                        >
                          <i className="ph-thin ph-trash text-xl"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeStorageHeader;