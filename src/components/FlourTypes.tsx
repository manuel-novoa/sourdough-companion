import React from 'react';
import { FlourType } from '../types';
import { useNumberInput } from '../hooks/useNumberInput';

interface FlourTypesProps {
  flourTypes: FlourType[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (flour: FlourType) => void;
}

const FlourInput: React.FC<{
  flour: FlourType;
  totalPercentage: number;
  fixedTotal: number;
  onUpdate: (flour: FlourType) => void;
  onRemove: (id: number) => void;
}> = ({ flour, totalPercentage, fixedTotal, onUpdate, onRemove }) => {
  const numberInput = useNumberInput(
    flour.percentage,
    (value) => {
      if (value === null) return;
      
      // Calculate new fixed total excluding current flour
      const otherFixedTotal = fixedTotal - (flour.isFixed ? flour.percentage : 0);
      
      // Check if new value would exceed available percentage
      if (flour.isFixed && value + otherFixedTotal > 100) {
        // Don't update if it would exceed 100%
        return;
      }
      
      onUpdate({ ...flour, percentage: value });
    },
    { min: 0, max: 100, allowEmpty: true }
  );

  const remainingForFixed = 100 - (fixedTotal - (flour.isFixed ? flour.percentage : 0));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-grow">
        <div className="relative">
          <i className="ph-thin ph-grain absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Flour name"
            value={flour.name}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            onChange={e => onUpdate({ ...flour, name: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-32">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min="0"
            max={flour.isFixed ? remainingForFixed : 100}
            {...numberInput}
            className={`w-full pl-4 pr-12 py-3 rounded-lg border transition-all ${
              flour.isFixed && flour.percentage + (fixedTotal - flour.percentage) > 100
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-bread-500 focus:border-transparent'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-bread-700">
            <input
              type="checkbox"
              checked={flour.isFixed}
              onChange={e => onUpdate({ ...flour, isFixed: e.target.checked })}
              className="rounded border-bread-300 text-bread-600 focus:ring-bread-500"
            />
            Lock
          </label>
          <button
            onClick={() => onRemove(flour.id)}
            className="p-2 text-bread-800 hover:text-bread-600 rounded-lg transition-all flex-shrink-0"
          >
            <i className="ph-thin ph-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FlourTypes: React.FC<FlourTypesProps> = ({ flourTypes, onAdd, onRemove, onUpdate }) => {
  // Calculate totals
  const totalPercentage = flourTypes.reduce((sum, flour) => sum + flour.percentage, 0);
  const fixedFlours = flourTypes.filter(f => f.isFixed);
  const fixedTotal = fixedFlours.reduce((sum, flour) => sum + flour.percentage, 0);
  const remainingPercentage = 100 - totalPercentage;
  const availableForFixed = 100 - fixedTotal;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-bread-800">Flour Composition</h3>
          <p className="text-sm text-bread-600 mt-1">
            Check "Lock" to prevent a flour's percentage from being automatically adjusted
          </p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${
            totalPercentage === 100 
              ? 'text-green-600' 
              : totalPercentage > 100 
                ? 'text-red-600'
                : 'text-bread-600'
          }`}>
            Total: {totalPercentage}%
          </div>
          {fixedFlours.length > 0 && (
            <div className="text-sm text-bread-600 mt-1">
              Locked: {fixedTotal}% (Available: {availableForFixed}%)
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {flourTypes.map(flour => (
          <FlourInput
            key={flour.id}
            flour={flour}
            totalPercentage={totalPercentage}
            fixedTotal={fixedTotal}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>

      {totalPercentage !== 100 && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          totalPercentage > 100
            ? 'bg-red-50 text-red-800'
            : 'bg-bread-50 text-bread-800'
        }`}>
          {totalPercentage > 100 
            ? 'The total percentage exceeds 100%. Please adjust the values.'
            : `The total percentage should be 100%. You need to add ${remainingPercentage}% more.`
          }
          {fixedFlours.length > 0 && totalPercentage < 100 && (
            <div className="mt-2">
              {availableForFixed < remainingPercentage 
                ? 'Warning: Locked percentages don\'t leave enough room for the remaining needed percentage.'
                : `Non-locked flours will be automatically adjusted to reach 100%.`
              }
            </div>
          )}
        </div>
      )}

      <button
        onClick={onAdd}
        className="mt-6 px-6 py-2 text-bread-800 rounded-lg hover:text-bread-600 transition-all flex items-center gap-2"
      >
        <i className="ph-thin ph-plus"></i>
        Add Flour Type
      </button>
    </div>
  );
};