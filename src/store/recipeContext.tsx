import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Recipe, FlourType, OtherIngredient, TimelineEntry } from '../types';
import { distributePercentages } from '../utils/calculations';

interface RecipeState {
  currentRecipe: Recipe | null;
  currentRecipeName: string | null;
  hasUnsavedChanges: boolean;
}

type RecipeAction =
  | { type: 'SET_RECIPE'; payload: { recipe: Recipe; name: string } }
  | { type: 'MARK_CHANGES' }
  | { type: 'CLEAR_CHANGES' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Recipe['settings']> }
  | { type: 'UPDATE_RESULTS'; payload: Partial<Recipe['results']> }
  | { type: 'ADD_FLOUR'; payload: FlourType }
  | { type: 'REMOVE_FLOUR'; payload: number }
  | { type: 'UPDATE_FLOUR'; payload: FlourType }
  | { type: 'ADD_INGREDIENT'; payload: OtherIngredient }
  | { type: 'REMOVE_INGREDIENT'; payload: number }
  | { type: 'UPDATE_INGREDIENT'; payload: OtherIngredient }
  | { type: 'ADD_TIMELINE_ENTRY'; payload: TimelineEntry }
  | { type: 'REMOVE_TIMELINE_ENTRY'; payload: number }
  | { type: 'UPDATE_TIMELINE_ENTRY'; payload: TimelineEntry }
  | { type: 'RESET_STATE' };

const defaultRecipe: Recipe = {
  metadata: {
    lastUpdated: new Date().toLocaleString(),
  },
  settings: {
    startDateTime: new Date().toISOString().slice(0, 16),
    numDoughballs: 1,
    weightPerDoughball: 900,
    hydration: 75,
    saltPercentage: 2,
    starterPercentage: 20,
    flourTypes: [
      {
        id: 1,
        name: 'Bread Flour',
        percentage: 100,
        isFixed: false,
      },
    ],
    otherIngredients: [],
  },
  results: {
    fermentation: '',
    crumbStructure: '',
    crust: '',
    flavorProfile: '',
    notes: '',
  },
  timeline: [],
};

const initialState: RecipeState = {
  currentRecipe: defaultRecipe,
  currentRecipeName: null,
  hasUnsavedChanges: false,
};

type RecipeContextType = {
  state: RecipeState;
  dispatch: React.Dispatch<RecipeAction>;
};

const RecipeContext = createContext<RecipeContextType | null>(null);

// Export the Provider component
export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  return <RecipeContext.Provider value={{ state, dispatch }}>{children}</RecipeContext.Provider>;
};

// Export the useRecipe hook
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};

// Export the useRecipeActions hook
export const useRecipeActions = () => {
  const { dispatch } = useRecipe();

  const setRecipe = useCallback(
    (recipe: Recipe, name: string) => {
      dispatch({ type: 'SET_RECIPE', payload: { recipe, name } });
    },
    [dispatch]
  );

  const markChanges = useCallback(() => {
    dispatch({ type: 'MARK_CHANGES' });
  }, [dispatch]);

  const clearChanges = useCallback(() => {
    dispatch({ type: 'CLEAR_CHANGES' });
  }, [dispatch]);

  const updateSettings = useCallback(
    (settings: Partial<Recipe['settings']>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    },
    [dispatch]
  );

  const updateResults = useCallback(
    (results: Partial<Recipe['results']>) => {
      dispatch({ type: 'UPDATE_RESULTS', payload: results });
    },
    [dispatch]
  );

  const addFlour = useCallback(
    (flour: Omit<FlourType, 'id'>) => {
      const newFlour: FlourType = {
        ...flour,
        id: Date.now(),
        isFixed: false,
      };
      dispatch({ type: 'ADD_FLOUR', payload: newFlour });
    },
    [dispatch]
  );

  const removeFlour = useCallback(
    (id: number) => {
      dispatch({ type: 'REMOVE_FLOUR', payload: id });
    },
    [dispatch]
  );

  const updateFlour = useCallback(
    (flour: FlourType) => {
      dispatch({ type: 'UPDATE_FLOUR', payload: flour });
    },
    [dispatch]
  );

  const addIngredient = useCallback(
    (ingredient: Omit<OtherIngredient, 'id'>) => {
      const newIngredient: OtherIngredient = {
        ...ingredient,
        id: Date.now(),
      };
      dispatch({ type: 'ADD_INGREDIENT', payload: newIngredient });
    },
    [dispatch]
  );

  const removeIngredient = useCallback(
    (id: number) => {
      dispatch({ type: 'REMOVE_INGREDIENT', payload: id });
    },
    [dispatch]
  );

  const updateIngredient = useCallback(
    (ingredient: OtherIngredient) => {
      dispatch({ type: 'UPDATE_INGREDIENT', payload: ingredient });
    },
    [dispatch]
  );

  const addTimelineEntry = useCallback(
    (entry: TimelineEntry) => {
      dispatch({ type: 'ADD_TIMELINE_ENTRY', payload: entry });
    },
    [dispatch]
  );

  const removeTimelineEntry = useCallback(
    (id: number) => {
      dispatch({ type: 'REMOVE_TIMELINE_ENTRY', payload: id });
    },
    [dispatch]
  );

  const updateTimelineEntry = useCallback(
    (entry: TimelineEntry) => {
      dispatch({ type: 'UPDATE_TIMELINE_ENTRY', payload: entry });
    },
    [dispatch]
  );

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  return {
    setRecipe,
    markChanges,
    clearChanges,
    updateSettings,
    updateResults,
    addFlour,
    removeFlour,
    updateFlour,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addTimelineEntry,
    removeTimelineEntry,
    updateTimelineEntry,
    resetState,
  };
};

const recipeReducer = (state: RecipeState, action: RecipeAction): RecipeState => {
  switch (action.type) {
    case 'SET_RECIPE':
      return {
        ...state,
        currentRecipe: action.payload.recipe,
        currentRecipeName: action.payload.name,
        hasUnsavedChanges: false,
      };

    case 'MARK_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: true,
      };

    case 'CLEAR_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: false,
      };

    case 'UPDATE_SETTINGS':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            ...action.payload,
          },
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_RESULTS':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          results: {
            ...state.currentRecipe.results,
            ...action.payload,
          },
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_FLOUR': {
      if (!state.currentRecipe) return state;
      
      const newFlourTypes = [...state.currentRecipe.settings.flourTypes, action.payload];
      const result = distributePercentages(newFlourTypes, action.payload.id);
      
      if (!result.success) {
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            settings: {
              ...state.currentRecipe.settings,
              flourTypes: newFlourTypes,
            },
          },
          hasUnsavedChanges: true,
        };
      }

      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            flourTypes: result.flourTypes,
          },
        },
        hasUnsavedChanges: true,
      };
    }

    case 'REMOVE_FLOUR': {
      if (!state.currentRecipe) return state;
      
      const remainingFlourTypes = state.currentRecipe.settings.flourTypes.filter(
        f => f.id !== action.payload
      );
      
      const result = distributePercentages(remainingFlourTypes);
      
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            flourTypes: result.success ? result.flourTypes : remainingFlourTypes,
          },
        },
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_FLOUR': {
      if (!state.currentRecipe) return state;
      
      const updatedFlourTypes = state.currentRecipe.settings.flourTypes.map(f =>
        f.id === action.payload.id ? action.payload : f
      );
      
      const currentFlour = state.currentRecipe.settings.flourTypes.find(
        f => f.id === action.payload.id
      );
      
      if (currentFlour && (
        currentFlour.isFixed !== action.payload.isFixed ||
        currentFlour.percentage !== action.payload.percentage
      )) {
        const result = distributePercentages(updatedFlourTypes, action.payload.id);
        
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            settings: {
              ...state.currentRecipe.settings,
              flourTypes: result.success ? result.flourTypes : updatedFlourTypes,
            },
          },
          hasUnsavedChanges: true,
        };
      }
      
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            flourTypes: updatedFlourTypes,
          },
        },
        hasUnsavedChanges: true,
      };
    }

    case 'ADD_INGREDIENT':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            otherIngredients: [...state.currentRecipe.settings.otherIngredients, action.payload],
          },
        },
        hasUnsavedChanges: true,
      };

    case 'REMOVE_INGREDIENT':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            otherIngredients: state.currentRecipe.settings.otherIngredients.filter(
              i => i.id !== action.payload
            ),
          },
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_INGREDIENT':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          settings: {
            ...state.currentRecipe.settings,
            otherIngredients: state.currentRecipe.settings.otherIngredients.map(i =>
              i.id === action.payload.id ? action.payload : i
            ),
          },
        },
        hasUnsavedChanges: true,
      };

    case 'ADD_TIMELINE_ENTRY':
      if (!state.currentRecipe) return state;
      const timeline = state.currentRecipe.timeline;
      const previousEntry = timeline.length > 0 ? timeline[timeline.length - 1] : null;
      const newEntry = {
        ...action.payload,
        timeDiff: previousEntry 
          ? Math.round((action.payload.timestamp.getTime() - new Date(previousEntry.timestamp).getTime()) / 60000)
          : 0
      };

      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          timeline: [...timeline, newEntry],
        },
        hasUnsavedChanges: true,
      };

    case 'REMOVE_TIMELINE_ENTRY':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          timeline: state.currentRecipe.timeline.filter(e => e.id !== action.payload),
        },
        hasUnsavedChanges: true,
      };

    case 'UPDATE_TIMELINE_ENTRY':
      if (!state.currentRecipe) return state;
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          timeline: state.currentRecipe.timeline.map(e =>
            e.id === action.payload.id ? action.payload : e
          ),
        },
        hasUnsavedChanges: true,
      };

    case 'RESET_STATE':
      return {
        ...initialState,
        currentRecipe: defaultRecipe,
      };

    default:
      return state;
  }
};

// Export constants and types
export { defaultRecipe, initialState };
export type { RecipeState, RecipeAction, RecipeContextType };