import React from 'react';
import { useNumberInput } from '../hooks/useNumberInput';

interface RecipeSettingsProps {
  startDateTime: string;
  numDoughballs: number;
  weightPerDoughball: number;
  hydration: number;
  saltPercentage: number;
  starterPercentage: number;
  onSettingsChange: (key: string, value: string | number) => void;
}

export const RecipeSettings: React.FC<RecipeSettingsProps> = ({
  startDateTime,
  numDoughballs,
  weightPerDoughball,
  hydration,
  saltPercentage,
  starterPercentage,
  onSettingsChange,
}) => {
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
  );
};