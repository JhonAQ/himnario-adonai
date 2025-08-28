import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
      onPress={() => onSelectDiagnostic(type)}
      className="flex-row items-center bg-surface-secondary p-4 rounded-xl border border-neutral-200 mb-3"
      activeOpacity={0.7}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
      }}
    >
      <View className="w-12 h-12 rounded-xl bg-primary-100 items-center justify-center mr-4">
        <Ionicons name={type.icon} size={24} color="#3B82F6" />
      </View>
      <View className="flex-1">
        <Text className="font-josefinSemibold text-base text-foreground mb-1">
          {type.title}
        </Text>
        <Text className="font-josefin text-sm text-foreground-secondary">
          {type.description}
        </Text>
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
      <View 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <View 
          className="m-5 bg-surface rounded-2xl w-11/12 max-h-4/5 p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-josefinBold text-xl text-foreground">
              Seleccionar Diagnóstico
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              className="p-2 rounded-full bg-surface-secondary"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <Text className="font-josefin text-sm text-foreground-secondary mb-6">
            Selecciona el tipo de diagnóstico a realizar
          </Text>
          
          <ScrollView 
            className="max-h-full"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={true}
          >
            {diagnosticTypes.map(renderDiagnosticTypeCard)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DiagnosticsSelectionModal;