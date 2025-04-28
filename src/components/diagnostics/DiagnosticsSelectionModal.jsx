import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DiagnosticsSelectionModal = ({ 
  visible, 
  onClose, 
  diagnosticTypes, 
  onSelectDiagnostic 
}) => {
  const renderDiagnosticTypeCard = (type) => (
    <TouchableOpacity
      key={type.id}
      style={styles.diagnosticTypeCard}
      onPress={() => onSelectDiagnostic(type)}
    >
      <View style={styles.diagnosticTypeIcon}>
        <Ionicons name={type.icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.diagnosticTypeContent}>
        <Text style={styles.diagnosticTypeTitle}>{type.title}</Text>
        <Text style={styles.diagnosticTypeDescription}>{type.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Diagnóstico</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Selecciona el tipo de diagnóstico a realizar
          </Text>
          
          {/* Reemplazamos el View con ScrollView para permitir desplazamiento */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.diagnosticTypesList}
            showsVerticalScrollIndicator={true}
          >
            {diagnosticTypes.map(renderDiagnosticTypeCard)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-Bold'
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'JosefinSans-Regular'
  },
  // Nuevo estilo para el contenedor de scroll
  scrollContainer: {
    maxHeight: '86%', // Ajusta esto según sea necesario
  },
  diagnosticTypesList: {
    paddingBottom: 16,
  },
  diagnosticTypeCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  diagnosticTypeIcon: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  diagnosticTypeContent: {
    flex: 1,
    paddingRight: 8,
  },
  diagnosticTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'JosefinSans-SemiBold'
  },
  diagnosticTypeDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'JosefinSans-Light'
  }
});

export default DiagnosticsSelectionModal;