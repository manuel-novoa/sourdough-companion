import React from 'react';
import { OtherIngredient } from '../types';
import { useNumberInput } from '../hooks/useNumberInput';

interface OtherIngredientsProps {
  ingredients: OtherIngredient[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (ingredient: OtherIngredient) => void;
}

// Create a separate component for each ingredient input to properly handle hooks
const IngredientInput: React.FC<{
  ingredient: OtherIngredient;
  onUpdate: (ingredient: OtherIngredient) => void;
  onRemove: (id: number) => void;
}> = ({ ingredient, onUpdate, onRemove }) => {
  const numberInput = useNumberInput(
    ingredient.weight,
    (value) => onUpdate({ ...ingredient, weight: value ?? 0 }),
    { min: 0, allowEmpty: true }
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-grow">
        <div className="relative">
          <i className="ph-thin ph-grain absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredient.name}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
            onChange={e => onUpdate({ ...ingredient, name: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-32">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            {...numberInput}
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">g</span>
        </div>
        <button
          onClick={() => onRemove(ingredient.id)}
          className="p-2 text-bread-800 hover:text-bread-600 rounded-lg transition-all flex-shrink-0"
        >
          <i className="ph-thin ph-x"></i>
        </button>
      </div>
    </div>
  );
};

export const OtherIngredients: React.FC<OtherIngredientsProps> = ({
  ingredients,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-bread-800 mb-4">Other Ingredients</h3>
      <div className="space-y-4">
        {ingredients.map(ingredient => (
          <IngredientInput
            key={ingredient.id}
            ingredient={ingredient}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-6 px-6 py-2 text-bread-800 rounded-lg hover:text-bread-600 transition-all flex items-center gap-2"
      >
        <i className="ph-thin ph-plus"></i>
        Add Ingredient
      </button>
    </div>
  );
};