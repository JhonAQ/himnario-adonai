import React from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';

const DiagnosticsLogsList = ({ logs, refreshing, onRefresh }) => {
  return (
    <ScrollView 
      style={styles.logsContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {logs.map((log) => (
        <View key={log.id.toString()} style={styles.logEntry}>
          <View style={styles.logHeader}>
            <Text style={[
              styles.logLevel,
              log.level.includes('ERROR') && styles.logLevelError,
              log.level.includes('WARN') && styles.logLevelWarning,
              log.level.includes('OK') && styles.logLevelSuccess,
            ]}>
              {log.level}
            </Text>
            <Text style={styles.logCategory}>[{log.category}]</Text>
            <Text style={styles.logTime}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={styles.logMessage}>{log.message}</Text>
          {log.details ? (
            <Text style={styles.logDetails}>{log.details}</Text>
          ) : null}
        </View>
      ))}
      
      {logs.length === 0 && (
        <Text style={styles.emptyText}>No hay registros disponibles</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
    fontFamily: 'JosefinSans-Light',
    fontSize: 14
  },
  logEntry: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 4
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  logLevel: {
    fontWeight: 'bold',
    marginRight: 6,
    fontFamily: 'JosefinSans-SemiBold'
  },
  logLevelError: {
    color: '#FF3B30'
  },
  logLevelWarning: {
    color: '#FF9500'
  },
  logLevelSuccess: {
    color: '#34C759'
  },
  logCategory: {
    color: '#007AFF',
    marginRight: 6,
    fontFamily: 'JosefinSans-Regular'
  },
  logTime: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'JosefinSans-Light'
  },
  logMessage: {
    fontSize: 14,
    fontFamily: 'JosefinSans-Regular'
  },
  logDetails: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    backgroundColor: '#f8f8f8',
    padding: 4,
    borderRadius: 4,
    fontFamily: 'JosefinSans-Light'
  }
});

export default DiagnosticsLogsList;