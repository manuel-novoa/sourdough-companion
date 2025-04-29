import React from 'react';
import { FlourType, OtherIngredient } from '../types';
import { useRecipe } from '../store/recipeContext';
import { useRecipePDF } from '../hooks/useRecipePDF';

interface RecipeOutputProps {
  flourAmounts: (FlourType & { amount: number })[];
  water: number;
  hydration: number;
  starter: number;
  starterPercentage: number;
  salt: number;
  saltPercentage: number;
  otherIngredients: OtherIngredient[];
  numDoughballs: number;
  finalDoughWeight: number;
}

export const RecipeOutput: React.FC<RecipeOutputProps> = ({
  flourAmounts,
  water,
  hydration,
  starter,
  starterPercentage,
  salt,
  saltPercentage,
  otherIngredients,
  numDoughballs,
  finalDoughWeight,
}) => {
  return (
    <div className="mt-8 p-6 bg-bread-50 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-bread-800 flex items-center gap-3">
          <i className="ph-thin ph-book-open text-2xl text-bread-800"></i>
          Recipe for {numDoughballs} {numDoughballs === 1 ? 'Doughball' : 'Doughballs'}:
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {flourAmounts.map(flour => (
          <div
            key={flour.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 text-gray-600 mb-3">
              <i className="ph-thin ph-package text-2xl text-bread-800"></i>
              <span className="font-medium">{flour.name}</span>
            </div>
            <div className="text-2xl font-semibold text-bread-800">{flour.amount}g</div>
            <div className="text-sm text-gray-500 mt-1">{flour.percentage}% of total flour</div>
          </div>
        ))}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-600 mb-3">
            <i className="ph-thin ph-drop text-2xl text-bread-800"></i>
            <span className="font-medium">Water</span>
          </div>
          <div className="text-2xl font-semibold text-bread-800">{water}g</div>
          <div className="text-sm text-gray-500 mt-1">{hydration}% hydration</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-600 mb-3">
            <i className="ph-thin ph-spiral text-2xl text-bread-800"></i>
            <span className="font-medium">Starter</span>
          </div>
          <div className="text-2xl font-semibold text-bread-800">{starter}g</div>
          <div className="text-sm text-gray-500 mt-1">{starterPercentage}% of total flour</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-gray-600 mb-3">
            <i className="ph-thin ph-dots-three-circle text-2xl text-bread-800"></i>
            <span className="font-medium">Salt</span>
          </div>
          <div className="text-2xl font-semibold text-bread-800">{salt}g</div>
          <div className="text-sm text-gray-500 mt-1">{saltPercentage}% of total flour</div>
        </div>
        {otherIngredients.map(ingredient => (
          <div
            key={ingredient.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 text-gray-600 mb-3">
              <i className="ph-thin ph-circle text-2xl text-bread-800"></i>
              <span className="font-medium">{ingredient.name}</span>
            </div>
            <div className="text-2xl font-semibold text-bread-800">{ingredient.weight}g</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 text-gray-600 bg-white p-4 rounded-lg shadow-sm">
        <i className="ph-thin ph-scales text-2xl text-bread-800"></i>
        <span className="font-medium">Final Dough Weight: {finalDoughWeight}g</span>
      </div>
    </div>
  );
};