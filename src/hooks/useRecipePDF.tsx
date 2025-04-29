import React, { useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Recipe } from '../types';
import RecipePDF from '../components/RecipePDF';

export const useRecipePDF = (recipe: Recipe) => {
  const generatePDF = useMemo(() => async () => {
    try {
      // Create the PDF with React element
      const blob = await pdf(
        React.createElement(RecipePDF, { recipe })
      ).toBlob();
      
      // Generate filename
      const filename = recipe.metadata.recipeName 
        ? `${recipe.metadata.recipeName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
        : 'sourdough-recipe.pdf';

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You might want to handle this error in the UI
    }
  }, [recipe]);

  return { generatePDF };
};