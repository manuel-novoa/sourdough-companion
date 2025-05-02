import React from 'react';
import { Document, Page, Text, View, Font, Link } from '@react-pdf/renderer';
import { Recipe } from '../types';
import { Bread, ClipboardText, Book, Clock, Package } from '../assets/pdf-icons/Icons';
import { styles, BackgroundPattern } from './RecipePDFStyles';

// Register a custom font for the PDF
Font.registerHyphenationCallback(word => [word]);

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZg.ttf',
      fontWeight: 'bold'
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZg.ttf',
      fontWeight: 'medium'
    }
  ]
});

interface RecipePDFProps {
  recipe: Recipe;
}

const RecipePDF: React.FC<RecipePDFProps> = ({ recipe }) => {
  const {
    settings: {
      numDoughballs,
      weightPerDoughball,
      hydration,
      saltPercentage,
      starterPercentage,
      flourTypes,
      otherIngredients,
    },
    metadata,
    timeline,
    results,
  } = recipe;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const totalDoughWeight = numDoughballs * weightPerDoughball;
  const totalFlour = Math.round(
    (totalDoughWeight) /
    (1 + (hydration / 100 + starterPercentage / 100 + saltPercentage / 100))
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <BackgroundPattern />
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{metadata.recipeName || 'Sourdough Recipe'}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.infoText}>
              Recipe for {numDoughballs} {numDoughballs === 1 ? 'doughball' : 'doughballs'} • {weightPerDoughball}g each
            </Text>
            <Text style={styles.infoText}>
              Total dough weight: {totalDoughWeight}g • {hydration}% hydration
            </Text>
            <Text style={styles.infoText}>
              Created: {formatDateTime(metadata.lastUpdated)}
            </Text>
          </View>
        </View>

        {/* Recipe Composition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package />
            <Text style={styles.sectionTitle}>Recipe Composition</Text>
          </View>
          <View style={styles.gridContainer}>
            {flourTypes.map((flour) => (
              <View key={flour.id} style={styles.gridItem}>
                <Text style={styles.label}>{flour.name}</Text>
                <Text style={styles.value}>{Math.round(totalFlour * (flour.percentage / 100))}g</Text>
                <Text style={styles.subValue}>{flour.percentage}% of total flour</Text>
              </View>
            ))}

            <View style={styles.gridItem}>
              <Text style={styles.label}>Starter</Text>
              <Text style={styles.value}>{Math.round(totalFlour * (starterPercentage / 100))}g</Text>
              <Text style={styles.subValue}>{starterPercentage}% of total flour</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Salt</Text>
              <Text style={styles.value}>{Math.round(totalFlour * (saltPercentage / 100))}g</Text>
              <Text style={styles.subValue}>{saltPercentage}% of total flour</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Water</Text>
              <Text style={styles.value}>{Math.round(totalFlour * (hydration / 100))}g</Text>
              <Text style={styles.subValue}>{hydration}% hydration</Text>
            </View>
          </View>
        </View>

        {/* Additional Ingredients */}
        {otherIngredients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Package />
              <Text style={styles.sectionTitle}>Additional Ingredients</Text>
            </View>
            <View style={styles.gridContainer}>
              {otherIngredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <Text style={styles.ingredientValue}>{ingredient.name}</Text>
                  <Text style={styles.ingredientWeight}>{ingredient.weight}g</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Baker's Journal */}
        {timeline.length > 0 && (
          <View style={styles.section} wrap={false}>
            <View style={styles.sectionHeader}>
              <ClipboardText />
              <Text style={styles.sectionTitle}>Baker's Journal</Text>
            </View>
            <View style={styles.journal}>
              {timeline.map((entry, index) => (
                <View key={entry.id} style={[
                  styles.journalEntry,
                  index === timeline.length - 1 ? {
                    borderBottom: 'none',
                    marginBottom: 0,
                    paddingBottom: 0
                  } : {}
                ]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Clock />
                    <Text style={styles.journalTime}>
                      {formatDateTime(entry.timestamp.toString())}
                      {index > 0 && entry.timeDiff > 0 && (
                        <Text style={styles.timeDiff}>
                          {" "}(+{entry.timeDiff} minutes)
                        </Text>
                      )}
                    </Text>
                  </View>
                  <Text style={styles.journalAction}>{entry.action}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Results and Reflection */}
        {(results.fermentation || results.crumbStructure || results.crust ||
          results.flavorProfile || results.notes) && (
            <View style={styles.section} wrap={false}>
              <View style={styles.sectionHeader}>
                <Book />
                <Text style={styles.sectionTitle}>Results & Reflection</Text>
              </View>
              <View>
                {results.fermentation && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Fermentation</Text>
                    <Text style={styles.resultValue}>{results.fermentation}</Text>
                  </View>
                )}
                {results.crumbStructure && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Crumb Structure</Text>
                    <Text style={styles.resultValue}>{results.crumbStructure}</Text>
                  </View>
                )}
                {results.crust && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Crust</Text>
                    <Text style={styles.resultValue}>{results.crust}</Text>
                  </View>
                )}
                {results.flavorProfile && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Flavor Profile</Text>
                    <Text style={styles.resultValue}>{results.flavorProfile}</Text>
                  </View>
                )}
                {results.notes && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Additional Notes</Text>
                    <Text style={styles.resultValue}>{results.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

        {/* Footer */}
        <Text style={styles.footer}>
          Created with <Link src="https://sourdough-companion.web.app/" style={styles.footerLink}>Sourdough Companion</Link> • {formatDateTime(metadata.lastUpdated)}
        </Text>
      </Page>
    </Document>
  );
};

export default RecipePDF;