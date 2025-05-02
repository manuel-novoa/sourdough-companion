import React, { useState } from 'react';
import { RecipeResults } from '../types';

interface ResultsProps {
  results: RecipeResults;
  onResultsChange: (key: string, value: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onResultsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <i className="ph-thin ph-chart-bar text-2xl text-bread-800"></i>
          <h2 className="text-lg font-medium text-bread-800">Results</h2>
        </div>
        <div className="flex items-center gap-4 text-bread-600">
          <span className="text-sm font-bold capitalize">
            {results.fermentation ? `Fermentation: ${results.fermentation}` : 'No results yet'}
          </span>
          <i className={`ph-thin ph-caret-${isExpanded ? 'up' : 'down'} text-xl transition-transform duration-200`}></i>
        </div>
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fermentation
              </label>
              <div className="flex gap-4">
                {(['under', 'perfect', 'over'] as const).map(status => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        name="fermentation"
                        value={status}
                        checked={results.fermentation === status}
                        onChange={e => onResultsChange('fermentation', e.target.value)}
                        className="appearance-none w-4 h-4 rounded-full border border-gray-300 
                                 checked:border-bread-600 checked:border-[5px] checked:bg-white
                                 focus:outline-none focus:ring-2 focus:ring-bread-500 focus:ring-offset-2
                                 transition-colors cursor-pointer"
                      />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-bread-800 capitalize transition-colors">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="crumbStructure"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Crumb Structure
              </label>
              <div className="relative">
                <i className="ph-thin ph-circles-four absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  id="crumbStructure"
                  value={results.crumbStructure}
                  onChange={e => onResultsChange('crumbStructure', e.target.value)}
                  placeholder="How was the crumb structure?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="crust" className="block text-sm font-medium text-gray-700 mb-2">
                Crust
              </label>
              <div className="relative">
                <i className="ph-thin ph-circle-half absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  id="crust"
                  value={results.crust}
                  onChange={e => onResultsChange('crust', e.target.value)}
                  placeholder="How was the crust?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="flavorProfile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Flavor Profile
              </label>
              <div className="relative">
                <i className="ph-thin ph-tongue absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  id="flavorProfile"
                  value={results.flavorProfile}
                  onChange={e => onResultsChange('flavorProfile', e.target.value)}
                  placeholder="How did it taste?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <div className="relative">
                <i className="ph-thin ph-note-pencil absolute left-3 top-3 text-gray-400"></i>
                <textarea
                  id="notes"
                  value={results.notes}
                  onChange={e => onResultsChange('notes', e.target.value)}
                  placeholder="Any additional notes?"
                  rows={4}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};