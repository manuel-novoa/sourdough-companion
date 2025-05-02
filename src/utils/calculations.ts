export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const calculateTimeDiff = (currentTime: Date, previousTime: Date | null): number => {
  if (!previousTime) return 0;
  return Math.round((currentTime.getTime() - previousTime.getTime()) / 60000); // Convert to minutes
};

export const formatTimeDiff = (minutes: number): string => {
  if (minutes === 0) return '';
  if (minutes < 60) return `+${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `+${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `+${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
};

// Helper function to create a Date object in local timezone
export const createLocalDate = (): Date => {
  return new Date();
};

export const calculateRecipeAmounts = ({
  numDoughballs,
  weightPerDoughball,
  hydration,
  saltPercentage,
  starterPercentage,
  flourTypes,
  otherIngredients,
}: {
  numDoughballs: number;
  weightPerDoughball: number;
  hydration: number;
  saltPercentage: number;
  starterPercentage: number;
  flourTypes: { percentage: number }[];
  otherIngredients: { weight: number }[];
}) => {
  const otherIngredientsTotalWeight = Math.round(
    otherIngredients.reduce((sum, ingredient) => sum + ingredient.weight, 0)
  );

  const total = Math.round(numDoughballs * weightPerDoughball);
  const totalFlour = Math.round(
    (total - otherIngredientsTotalWeight) /
      (1 + (hydration / 100 + starterPercentage / 100 + saltPercentage / 100))
  );

  const water = Math.round(totalFlour * (hydration / 100));
  const starter = Math.round(totalFlour * (starterPercentage / 100));
  const salt = Math.round(totalFlour * (saltPercentage / 100));

  const flourAmounts = flourTypes.map(flour => ({
    ...flour,
    amount: Math.round(totalFlour * (flour.percentage / 100)),
  }));

  return {
    totalFlour,
    water,
    starter,
    salt,
    flourAmounts,
    finalDoughWeight: totalFlour + water + starter + salt + otherIngredientsTotalWeight,
  };
};

interface FlourWithId {
  id: number;
  percentage: number;
  isFixed?: boolean;
}

export const distributePercentages = <T extends FlourWithId>(
  flourTypes: T[],
  updatedFlourId?: number
): { success: boolean; flourTypes: T[]; error?: string } => {
  if (flourTypes.length === 0) {
    return { success: true, flourTypes };
  }

  // Get fixed flours and calculate their total percentage
  const fixedFlours = flourTypes.filter(f => f.isFixed || f.id === updatedFlourId);
  const fixedTotal = fixedFlours.reduce((sum, f) => sum + f.percentage, 0);

  // If fixed total exceeds 100%, return error
  if (fixedTotal > 100) {
    return {
      success: false,
      flourTypes,
      error: `Fixed percentages total ${fixedTotal}% which exceeds 100%`
    };
  }

  // Get non-fixed flours
  const nonFixedFlours = flourTypes.filter(f => !f.isFixed && f.id !== updatedFlourId);
  
  // Calculate remaining percentage for non-fixed flours
  const remainingPercentage = 100 - fixedTotal;

  // If no non-fixed flours, we're done
  if (nonFixedFlours.length === 0) {
    return { success: true, flourTypes };
  }

  // Calculate current total of non-fixed flours
  const nonFixedTotal = nonFixedFlours.reduce((sum, f) => sum + f.percentage, 0);

  // Distribute remaining percentage among non-fixed flours
  const distributedFlours = flourTypes.map(flour => {
    if (flour.isFixed || flour.id === updatedFlourId) {
      return flour;
    }

    // If non-fixed total is 0, distribute evenly
    if (nonFixedTotal === 0) {
      return {
        ...flour,
        percentage: Math.round((remainingPercentage / nonFixedFlours.length) * 10) / 10
      };
    }

    // Otherwise, distribute proportionally
    const proportion = flour.percentage / nonFixedTotal;
    return {
      ...flour,
      percentage: Math.round((remainingPercentage * proportion) * 10) / 10
    };
  });

  return { success: true, flourTypes: distributedFlours };
};