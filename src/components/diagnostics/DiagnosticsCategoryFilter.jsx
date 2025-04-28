import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DiagnosticsCategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        activeCategory === category.id && styles.categoryButtonActive
      ]}
      onPress={() => setActiveCategory(category.id)}
    >
      <Ionicons 
        name={category.icon} 
        size={16} 
        color={activeCategory === category.id ? '#ffffff' : '#666666'} 
      />
      <Text style={[
        styles.categoryButtonText,
        activeCategory === category.id && styles.categoryButtonTextActive
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    height: 40,        // Establece una altura fija para todo el componente
    marginBottom: 8    // Un pequeño margen inferior
  },
  categoriesContainer: {
    paddingHorizontal: 4,
    alignItems: 'center',  // Centra verticalmente los items
    height: '100%',        // Usa toda la altura del contenedor padre
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    height: 32,            // Altura fija para los botones
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#666666',
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'JosefinSans-Medium'
  },
  categoryButtonTextActive: {
    color: '#ffffff'
  }
});

export default DiagnosticsCategoryFilter;