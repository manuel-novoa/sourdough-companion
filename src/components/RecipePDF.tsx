import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Recipe } from '../types';
import { Bread, ClipboardText, Book, Clock, Package } from '../assets/pdf-icons/Icons';

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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Inter',
  },
  section: {
    marginBottom: 30,
    breakInside: 'avoid',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2 solid #F2E8E5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    paddingRight: 50,
    minHeight: 80,
  },
  headerRight: {
    flex: 1,
    backgroundColor: '#F9F5F3',
    padding: 15,
    borderRadius: 4,
  },

  title: {
    fontSize: 20,
    color: '#846358',
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  infoText: {
    fontSize: 10,
    color: '#846358',
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    color: '#846358',
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    paddingRight: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 10,
    color: '#977669',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#43302b',
    fontWeight: 'medium',
  },
  subValue: {
    fontSize: 10,
    color: '#977669',
    marginTop: 2,
  },
  journal: {
    backgroundColor: '#FFFBF9',
    padding: 15,
    borderRadius: 4,
    borderLeft: '3 solid #F2E8E5',
    breakInside: 'avoid',
  },
  journalEntry: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '0.5 dashed #F2E8E5',
  },
  journalTime: {
    fontSize: 9,
    paddingLeft: 5,
    color: '#977669',
    fontWeight: 'medium',
  },
  journalAction: {
    fontSize: 11,
    paddingTop: 10,
    color: '#43302b',
    lineHeight: 1.4,
  },
  timeDiff: {
    fontSize: 8,
    color: '#977669',
    marginLeft: 10,
  },
  resultItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#FFFBF9',
    borderRadius: 4,
    breakInside: 'avoid',
  },
  resultLabel: {
    fontSize: 10,
    color: '#846358',
    marginBottom: 4,
    fontWeight: 'medium',
  },
  resultValue: {
    fontSize: 11,
    color: '#43302b',
    lineHeight: 1.4,
  },
  ingredientItem: {
    width: '33.33%',
    paddingRight: 15,
    marginBottom: 12,
  },
  ingredientValue: {
    fontSize: 12,
    color: '#43302b',
    marginBottom: 2,
  },
  ingredientWeight: {
    fontSize: 10,
    color: '#977669',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#977669',
    textAlign: 'center',
    paddingTop: 10,
    borderTop: '1 solid #F2E8E5',
  },
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
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Bread />
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
          Created with Sourdough Companion • {formatDateTime(metadata.lastUpdated)}
        </Text>
      </Page>
    </Document>
  );
};

export default RecipePDF;