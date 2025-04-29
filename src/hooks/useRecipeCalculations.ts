import { useMemo } from 'react';
import { useRecipe } from '../store/recipeContext';
import { calculateRecipeAmounts } from '../utils/calculations';

export const useRecipeCalculations = () => {
  const { state } = useRecipe();

  const calculations = useMemo(() => {
    if (!state.currentRecipe) return null;

    const {
      numDoughballs,
      weightPerDoughball,
      hydration,
      saltPercentage,
      starterPercentage,
      flourTypes,
      otherIngredients,
    } = state.currentRecipe.settings;

    return calculateRecipeAmounts({
      numDoughballs,
      weightPerDoughball,
      hydration,
      saltPercentage,
      starterPercentage,
      flourTypes,
      otherIngredients,
    });
  }, [state.currentRecipe]);

  const tips = useMemo(() => {
    if (!state.currentRecipe) return [];

    const { hydration } = state.currentRecipe.settings;
    const { flourTypes } = state.currentRecipe.settings;

    const tips = [
      // Hydration tips
      `Consider that with ${hydration}% hydration, you might expect a ${
        hydration < 70 ? 'slightly firmer dough that\'s easier to handle' : 'looser dough that may need gentler handling'
      }.`,

      // Starter tips
      'Try to use your starter when it\'s at peak activity - usually 4-8 hours after feeding, when it\'s doubled in size.',

      // Temperature and fermentation tips
      'For best results, aim to keep your dough temperature around 75-78°F (24-26°C) during bulk fermentation.',

      // Shaping and handling tips
      'A light dusting of rice flour in your banneton can help prevent sticking and make the transfer easier.',
      `${
        hydration > 75
          ? 'Given the higher hydration, you might find coil folds work better than stretch and folds for handling the dough.'
          : 'Regular stretch and folds will help develop a strong gluten structure.'
      }`,

      // Baking tips
      'Preheat your Dutch oven for at least 45-60 minutes at 450°F (230°C) to ensure it\'s thoroughly heated.',
      'Create steam by spraying water in the oven or using ice cubes in a separate pan for better crust development.',
      'For optimal crust, remove the Dutch oven lid after 20-25 minutes and continue baking until deep golden brown.',
      'To test for doneness, tap the bottom of the loaf - it should sound hollow. Internal temperature should reach 205-210°F (96-99°C).',
      'Let the bread cool completely (at least 1-2 hours) before cutting to prevent the crumb from becoming gummy.',

      // Scoring tips
      'Score the dough about ¼ to ½ inch deep at a 45-degree angle for best results.',
      'For high-hydration doughs, keep your lame or razor blade wet to prevent sticking during scoring.',

      // Temperature management
      'If your kitchen is cold (below 70°F/21°C), consider using slightly warmer water or extending fermentation time.',
      'In summer or warmer conditions, use cooler water and watch fermentation more closely as it will happen faster.',
    ];

    // Add tips for special flour types
    if (flourTypes.some(f => f.name.toLowerCase().includes('whole'))) {
      tips.push(
        'Since you\'re using whole grain flour, you might notice faster fermentation and more water absorption - keep an eye on the dough\'s development.',
        'Whole grain flours benefit from a longer autolyse period (2-4 hours) to fully hydrate the bran.'
      );
    }
    if (flourTypes.some(f => f.name.toLowerCase().includes('rye'))) {
      tips.push(
        'Working with rye flour? You might notice a denser crumb - that\'s normal! Rye has less gluten, so handle it gently.',
        'Rye doughs can be quite sticky - use wet hands instead of flour when handling.'
      );
    }

    return tips;
  }, [state.currentRecipe]);

  return {
    calculations,
    tips,
  };
};