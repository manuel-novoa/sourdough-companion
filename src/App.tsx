import React, { useCallback } from 'react';
import { FlourTypes } from './components/FlourTypes';
import { OtherIngredients } from './components/OtherIngredients';
import { Timeline } from './components/Timeline';
import { RecipeOutput } from './components/RecipeOutput';
import { Tips } from './components/Tips';
import { RecipeSettings } from './components/RecipeSettings';
import { Results } from './components/Results';
import RecipeStorageHeader from './components/RecipeStorageHeader';
import { useRecipe, useRecipeActions } from './store/recipeContext';
import { useRecipeCalculations } from './hooks/useRecipeCalculations';
import type { FlourType, OtherIngredient, TimelineEntry } from './types';

export const App: React.FC = () => {
  const { state } = useRecipe();
  const {
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
  } = useRecipeActions();
  const { calculations, tips } = useRecipeCalculations();

  const handleSettingsChange = useCallback(
    (key: string, value: string | number) => {
      updateSettings({ [key]: value });
    },
    [updateSettings]
  );

  const handleResultsChange = useCallback(
    (key: string, value: string) => {
      updateResults({ [key]: value });
    },
    [updateResults]
  );

  const handleAddFlour = useCallback(() => {
    const newFlour: Omit<FlourType, 'id'> = {
      name: '',
      percentage: 0,
    };
    addFlour(newFlour);
  }, [addFlour]);

  const handleAddIngredient = useCallback(() => {
    const newIngredient: Omit<OtherIngredient, 'id'> = {
      name: '',
      weight: 0,
    };
    addIngredient(newIngredient);
  }, [addIngredient]);

  const handleAddTimelineEntry = useCallback(() => {
    const newEntry: TimelineEntry = {
      id: Date.now(),
      timestamp: new Date(),
      timeDiff: 0,
      action: '',
    };
    addTimelineEntry(newEntry);
  }, [addTimelineEntry]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-bread-800 mb-2">
            Sourdough Companion
          </h1>
          <p className="text-bread-600">Create your perfect sourdough recipe</p>
        </header>

        <RecipeStorageHeader />

        <Tips tips={tips} />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {state.currentRecipe && (
            <>
              <RecipeSettings
                startDateTime={state.currentRecipe.settings.startDateTime}
                numDoughballs={state.currentRecipe.settings.numDoughballs}
                weightPerDoughball={state.currentRecipe.settings.weightPerDoughball}
                hydration={state.currentRecipe.settings.hydration}
                saltPercentage={state.currentRecipe.settings.saltPercentage}
                starterPercentage={state.currentRecipe.settings.starterPercentage}
                onSettingsChange={handleSettingsChange}
              />

              <FlourTypes
                flourTypes={state.currentRecipe.settings.flourTypes}
                onAdd={handleAddFlour}
                onRemove={removeFlour}
                onUpdate={updateFlour}
              />

              <OtherIngredients
                ingredients={state.currentRecipe.settings.otherIngredients}
                onAdd={handleAddIngredient}
                onRemove={removeIngredient}
                onUpdate={updateIngredient}
              />

              {calculations && (
                <RecipeOutput
                  flourAmounts={calculations.flourAmounts}
                  water={calculations.water}
                  hydration={state.currentRecipe.settings.hydration}
                  starter={calculations.starter}
                  starterPercentage={state.currentRecipe.settings.starterPercentage}
                  salt={calculations.salt}
                  saltPercentage={state.currentRecipe.settings.saltPercentage}
                  otherIngredients={state.currentRecipe.settings.otherIngredients}
                  numDoughballs={state.currentRecipe.settings.numDoughballs}
                  finalDoughWeight={calculations.finalDoughWeight}
                />
              )}
            </>
          )}
        </div>

        <div className="space-y-8">
          {state.currentRecipe && (
            <>
              <Timeline
                entries={state.currentRecipe.timeline}
                onAdd={handleAddTimelineEntry}
                onRemove={removeTimelineEntry}
                onUpdate={updateTimelineEntry}
              />

              <Results
                results={state.currentRecipe.results}
                onResultsChange={handleResultsChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;