import React, { useCallback } from 'react';
import { Timeline } from './components/Timeline';
import { RecipeOutput } from './components/RecipeOutput';
import { Tips } from './components/Tips';
import { RecipeSettings } from './components/RecipeSettings';
import { Results } from './components/Results';
import { BackgroundPattern } from './components/BackgroundPattern';
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
    <div className="relative bg-gray-50 text-gray-900 min-h-screen">
      <BackgroundPattern />
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <header className="text-left mb-1">
          <h1 className="text-5xl md:text-6xl font-rustic text-bread-800 mb-3 tracking-wide">
            Sourdough Companion
          </h1>
          <p className="text-3xl font-handwritten text-bread-600">Create your perfect sourdough recipe</p>
        </header>

        <RecipeStorageHeader />

        {state.currentRecipe && (
          <>
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

            <RecipeSettings
              startDateTime={state.currentRecipe.settings.startDateTime}
              numDoughballs={state.currentRecipe.settings.numDoughballs}
              weightPerDoughball={state.currentRecipe.settings.weightPerDoughball}
              hydration={state.currentRecipe.settings.hydration}
              saltPercentage={state.currentRecipe.settings.saltPercentage}
              starterPercentage={state.currentRecipe.settings.starterPercentage}
              flourTypes={state.currentRecipe.settings.flourTypes}
              otherIngredients={state.currentRecipe.settings.otherIngredients}
              onSettingsChange={handleSettingsChange}
              onFlourAdd={handleAddFlour}
              onFlourRemove={removeFlour}
              onFlourUpdate={updateFlour}
              onIngredientAdd={handleAddIngredient}
              onIngredientRemove={removeIngredient}
              onIngredientUpdate={updateIngredient}
            />

            <div className="space-y-8">
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

              <Tips tips={tips} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;