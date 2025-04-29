import React, { useState, useEffect } from 'react';
import { useRecipeStorage } from '../hooks/useRecipeStorage';

interface SaveLoadModalProps {
  mode: 'save' | 'load';
  onClose: () => void;
  currentName?: string;
  hasUnsavedChanges?: boolean;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  mode,
  onClose,
  currentName,
  hasUnsavedChanges,
}) => {
  const [recipeName, setRecipeName] = useState(currentName || '');
  const [recipes, setRecipes] = useState<Array<{ name: string; date: string }>>([]);
  const { saveRecipe, loadRecipe, deleteRecipe, listRecipes, loading, error } = useRecipeStorage();

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipeList = await listRecipes();
      setRecipes(recipeList);
    };

    if (mode === 'load') {
      fetchRecipes();
    }
  }, [mode, listRecipes]);

  const handleSave = async () => {
    if (!recipeName.trim()) {
      alert('Please enter a recipe name');
      return;
    }

    const exists = recipes.some(recipe => recipe.name === recipeName);
    if (exists && !confirm('A recipe with this name already exists. Do you want to overwrite it?')) {
      return;
    }

    const success = await saveRecipe(recipeName);
    if (success) {
      onClose();
    }
  };

  const handleLoad = async (name: string) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Do you want to continue without saving?')) {
        return;
      }
    }

    const success = await loadRecipe(name);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    const success = await deleteRecipe(name);
    if (success) {
      const updatedRecipes = await listRecipes();
      setRecipes(updatedRecipes);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col">
        <h3 className="text-xl font-semibold text-bread-800 mb-4">
          {mode === 'save' ? 'Save Recipe' : 'Load Recipe'}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {mode === 'save' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
            <input
              type="text"
              value={recipeName}
              onChange={e => setRecipeName(e.target.value)}
              placeholder="Enter a name for this recipe"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {mode === 'load' && (
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No saved recipes found.</div>
            ) : (
              recipes.map(recipe => (
                <div
                  key={recipe.name}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg group"
                >
                  <button
                    onClick={() => handleLoad(recipe.name)}
                    className="flex-1 text-left flex items-center justify-between"
                  >
                    <span className="text-gray-700 group-hover:text-bread-800">
                      {recipe.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(recipe.date).toLocaleString()}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.name)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                  >
                    <i className="ph-thin ph-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 rounded-lg hover:text-gray-700 transition-all"
          >
            Cancel
          </button>
          {mode === 'save' && (
            <button
              onClick={handleSave}
              disabled={loading || !recipeName.trim()}
              className="px-4 py-2 text-bread-800 rounded-lg hover:text-bread-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};