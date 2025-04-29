import React from 'react';
import { RecipeResults } from '../types';

interface ResultsProps {
  results: RecipeResults;
  onResultsChange: (key: keyof RecipeResults, value: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onResultsChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-bread-800 mb-6">Results & Reflections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crumb Structure</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            rows={2}
            placeholder="Describe the crumb structure..."
            value={results.crumbStructure}
            onChange={e => onResultsChange('crumbStructure', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crust</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            rows={2}
            placeholder="Describe the crust..."
            value={results.crust}
            onChange={e => onResultsChange('crust', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flavor Profile</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            rows={2}
            placeholder="Describe the flavor..."
            value={results.flavorProfile}
            onChange={e => onResultsChange('flavorProfile', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fermentation Assessment
          </label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center gap-3 p-2 rounded-lg cursor-pointer group">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <input
                  type="radio"
                  name="fermentation"
                  value="under"
                  checked={results.fermentation === 'under'}
                  onChange={e => onResultsChange('fermentation', e.target.value)}
                  className="peer hidden"
                />
                <i className="ph-thin ph-circle absolute text-xl text-gray-300 group-hover:text-bread-500 peer-checked:hidden transition-colors"></i>
                <i className="ph-fill ph-radio-button absolute text-xl hidden peer-checked:block text-bread-600"></i>
              </div>
              <span className="text-gray-700 group-hover:text-bread-800 peer-checked:text-bread-800">
                Under
              </span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-3 p-2 rounded-lg cursor-pointer group">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <input
                  type="radio"
                  name="fermentation"
                  value="perfect"
                  checked={results.fermentation === 'perfect'}
                  onChange={e => onResultsChange('fermentation', e.target.value)}
                  className="peer hidden"
                />
                <i className="ph-thin ph-circle absolute text-xl text-gray-300 group-hover:text-bread-500 peer-checked:hidden transition-colors"></i>
                <i className="ph-fill ph-radio-button absolute text-xl hidden peer-checked:block text-bread-600"></i>
              </div>
              <span className="text-gray-700 group-hover:text-bread-800 peer-checked:text-bread-800">
                Good
              </span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-3 p-2 rounded-lg cursor-pointer group">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <input
                  type="radio"
                  name="fermentation"
                  value="over"
                  checked={results.fermentation === 'over'}
                  onChange={e => onResultsChange('fermentation', e.target.value)}
                  className="peer hidden"
                />
                <i className="ph-thin ph-circle absolute text-xl text-gray-300 group-hover:text-bread-500 peer-checked:hidden transition-colors"></i>
                <i className="ph-fill ph-radio-button absolute text-xl hidden peer-checked:block text-bread-600"></i>
              </div>
              <span className="text-gray-700 group-hover:text-bread-800 peer-checked:text-bread-800">
                Over
              </span>
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes for Next Time</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            rows={3}
            placeholder="What would you change for next time?"
            value={results.notes}
            onChange={e => onResultsChange('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};