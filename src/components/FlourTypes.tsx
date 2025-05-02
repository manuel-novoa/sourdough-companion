import React, { useMemo } from 'react';
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
  fixedTotal: number;
  onUpdate: (flour: FlourType) => void;
  onRemove: (id: number) => void;
  isLastFlour: boolean;
}> = ({ flour, fixedTotal, onUpdate, onRemove, isLastFlour }) => {
  // Calculate new fixed total excluding current flour
  const remainingForFixed = useMemo(() => {
    const available = 100 - (fixedTotal - (flour.isFixed ? flour.percentage : 0));
    return Math.max(0, Math.min(100, available)); // Ensure value is between 0 and 100
  }, [fixedTotal, flour.isFixed, flour.percentage]);

  const numberInput = useNumberInput(
    flour.percentage,
    (value) => {
      if (value === null) return;
      const validValue = Math.max(0, Math.min(remainingForFixed, value));
      onUpdate({ ...flour, percentage: validValue });
    },
    { min: 0, max: remainingForFixed, allowEmpty: true }
  );

  const hasError = flour.isFixed && flour.percentage + (fixedTotal - flour.percentage) > 100;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...flour, name: e.target.value });
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    if (trimmedValue !== e.target.value) {
      onUpdate({ ...flour, name: trimmedValue });
    }
  };

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
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            aria-label="Flour name"
            required
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
            className={`w-full pl-4 pr-12 py-3 rounded-lg border transition-all ${hasError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-bread-500 focus:border-transparent'}`}
            aria-label="Flour percentage"
            title={`Enter a value between 0 and ${remainingForFixed}%`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          {hasError && (
            <p className="absolute text-xs text-red-600 mt-1">
              Exceeds available percentage
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-bread-700">
            <input
              type="checkbox"
              checked={flour.isFixed}
              onChange={e => onUpdate({ ...flour, isFixed: e.target.checked })}
              className="rounded border-bread-300 text-bread-600 focus:ring-bread-500"
              aria-label="Lock flour percentage"
            />
            Lock
          </label>
          <button
            onClick={() => onRemove(flour.id)}
            className="p-2 text-bread-800 hover:text-bread-600 rounded-lg transition-all flex-shrink-0 disabled:opacity-50"
            disabled={isLastFlour}
            aria-label="Remove flour"
            title={isLastFlour ? "Cannot remove last flour" : "Remove flour"}
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
  const { totalPercentage, fixedTotal, remainingPercentage, availableForFixed } = useMemo(() => {
    const total = flourTypes.reduce((sum, flour) => sum + flour.percentage, 0);
    const fixedFlours = flourTypes.filter(f => f.isFixed);
    const fixedSum = fixedFlours.reduce((sum, flour) => sum + flour.percentage, 0);
    return {
      totalPercentage: Math.round(total * 10) / 10, // Round to 1 decimal place
      fixedTotal: fixedSum,
      remainingPercentage: Math.max(0, 100 - total),
      availableForFixed: Math.max(0, 100 - fixedSum)
    };
  }, [flourTypes]);

  const canAddMore = flourTypes.length < 10; // Limit to 10 flour types
  
  const totalPercentageClass = totalPercentage === 100
    ? 'hidden'
    : totalPercentage > 100
      ? 'text-bread-800'
      : 'text-bread-500';

  const alertClass = totalPercentage > 100
    ? 'bg-red-50 text-red-800'
    : 'bg-bread-50 text-bread-800';

  const addButtonClass = canAddMore
    ? 'text-bread-800 hover:text-bread-600'
    : 'text-bread-400 cursor-not-allowed';

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
          <div className={`text-sm font-bold ${totalPercentageClass}`} role="status" aria-live="polite">
            {remainingPercentage}% of flour pending to allocate
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {flourTypes.map((flour, index) => (
          <FlourInput
            key={flour.id}
            flour={flour}
            fixedTotal={fixedTotal}
            onUpdate={onUpdate}
            onRemove={onRemove}
            isLastFlour={flourTypes.length === 1}
          />
        ))}
      </div>

      {totalPercentage !== 100 && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${alertClass}`} role="alert">
          {totalPercentage > 100
            ? 'The total percentage exceeds 100%. Please adjust the values.'
            : `The total percentage should be 100%. You need to add ${remainingPercentage}% more.`
          }
          {flourTypes.some(f => f.isFixed) && totalPercentage < 100 && (
            <div className="mt-2">
              {availableForFixed < remainingPercentage
                ? 'Warning: Locked percentages don\'t leave enough room for the remaining needed percentage.'
                : 'Non-locked flours will be automatically adjusted to reach 100%.'}
            </div>
          )}
        </div>
      )}

      <button
        onClick={onAdd}
        className={`mt-6 px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${addButtonClass}`}
        disabled={!canAddMore}
        aria-label={canAddMore ? "Add flour type" : "Maximum flour types reached"}
      >
        <i className="ph-thin ph-plus"></i>
        Add Flour Type
        {!canAddMore && <span className="text-xs ml-2">(Max 10)</span>}
      </button>
    </div>
  );
};