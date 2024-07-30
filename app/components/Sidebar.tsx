import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('PumpControlScreen');
            onClose();
          }}
        >
          <Text style={styles.buttonText}>Contrôle de la pompe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Planning');
            onClose();
          }}
        >
          <Text style={styles.buttonText}>Planification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Déconnexion');
            onClose();
          }}
        >
          <Text style={styles.buttonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fermer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Sidebar;
