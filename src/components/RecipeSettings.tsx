import React, { useState } from 'react';
import { useNumberInput } from '../hooks/useNumberInput';
import { FlourType, OtherIngredient } from '../types';
import { FlourTypes } from './FlourTypes';
import { OtherIngredients } from './OtherIngredients';

interface RecipeSettingsProps {
  startDateTime: string;
  numDoughballs: number;
  weightPerDoughball: number;
  hydration: number;
  saltPercentage: number;
  starterPercentage: number;
  flourTypes: FlourType[];
  otherIngredients: OtherIngredient[];
  onSettingsChange: (key: string, value: string | number) => void;
  onFlourAdd: () => void;
  onFlourRemove: (id: number) => void;
  onFlourUpdate: (flour: FlourType) => void;
  onIngredientAdd: () => void;
  onIngredientRemove: (id: number) => void;
  onIngredientUpdate: (ingredient: OtherIngredient) => void;
}

export const RecipeSettings: React.FC<RecipeSettingsProps> = ({
  startDateTime,
  numDoughballs,
  weightPerDoughball,
  hydration,
  saltPercentage,
  starterPercentage,
  flourTypes,
  otherIngredients,
  onSettingsChange,
  onFlourAdd,
  onFlourRemove,
  onFlourUpdate,
  onIngredientAdd,
  onIngredientRemove,
  onIngredientUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const numDoughballsInput = useNumberInput(
    numDoughballs,
    value => onSettingsChange('numDoughballs', value ?? 1),
    { min: 1, defaultValue: 1 }
  );

  const weightPerDoughballInput = useNumberInput(
    weightPerDoughball,
    value => onSettingsChange('weightPerDoughball', value ?? 500),
    { min: 500, defaultValue: 500 }
  );

  const hydrationInput = useNumberInput(
    hydration,
    value => onSettingsChange('hydration', value ?? 65),
    { min: 65, max: 85, defaultValue: 65 }
  );

  const saltPercentageInput = useNumberInput(
    saltPercentage,
    value => onSettingsChange('saltPercentage', value ?? 1),
    { min: 1, max: 5, defaultValue: 1 }
  );

  const starterPercentageInput = useNumberInput(
    starterPercentage,
    value => onSettingsChange('starterPercentage', value ?? 10),
    { min: 10, max: 40, defaultValue: 10 }
  );

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <i className="ph-thin ph-sliders text-xl text-bread-800"></i>
          <h2 className="text-lg font-medium text-bread-800">Recipe Settings</h2>
        </div>
        <div className="flex items-center gap-4 text-bread-600">
          <span className="text-sm font-bold">
            {numDoughballs} × {weightPerDoughball}g • {hydration}% hydration
          </span>
          <i className={`ph-thin ph-caret-${isExpanded ? 'up' : 'down'} text-xl transition-transform duration-200`}></i>
        </div>
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <div className="relative">
                  <i className="ph-thin ph-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="datetime-local"
                    id="startDateTime"
                    value={startDateTime}
                    onChange={e => onSettingsChange('startDateTime', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="numDoughballs" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Doughballs
                </label>
                <div className="relative">
                  <i className="ph-thin ph-bread absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="numDoughballs"
                    {...numDoughballsInput}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="weightPerDoughball" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight per Doughball (g)
                </label>
                <div className="relative">
                  <i className="ph-thin ph-scales absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="weightPerDoughball"
                    {...weightPerDoughballInput}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="hydration" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Hydration (%)
                </label>
                <div className="relative">
                  <i className="ph-thin ph-drop absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="hydration"
                    {...hydrationInput}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="saltPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                Salt Percentage
              </label>
              <div className="relative">
                <i className="ph-thin ph-dots-three-circle absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="saltPercentage"
                  {...saltPercentageInput}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label htmlFor="starterPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                Starter Percentage
              </label>
              <div className="relative">
                <i className="ph-thin ph-spiral absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="starterPercentage"
                  {...starterPercentageInput}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Flour Types */}
          <FlourTypes
            flourTypes={flourTypes}
            onAdd={onFlourAdd}
            onRemove={onFlourRemove}
            onUpdate={onFlourUpdate}
          />

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Other Ingredients */}
          <OtherIngredients
            ingredients={otherIngredients}
            onAdd={onIngredientAdd}
            onRemove={onIngredientRemove}
            onUpdate={onIngredientUpdate}
          />
        </div>
      </div>
    </div>
  );
};