import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

interface PlanningItem {
  id: string;
  pumpId: string;
  date: string;
  time: string;
}

const PlanningScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [pumpId, setPumpId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [plans, setPlans] = useState<PlanningItem[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addPlan = async () => {
    if (pumpId && date && time) {
      const newPlan: PlanningItem = {
        id: Date.now().toString(),
        pumpId,
        date,
        time,
      };

      // Save the new plan to AsyncStorage
      try {
        const existingPlans = JSON.parse(await AsyncStorage.getItem('plans') || '[]');
        existingPlans.push(newPlan);
        await AsyncStorage.setItem('plans', JSON.stringify(existingPlans));
        setPlans(existingPlans);
        toggleModal(); // Close the modal after adding
        // Clear the form
        setPumpId('');
        setDate('');
        setTime('');
      } catch (error) {
        console.error('Failed to save the plan:', error);
      }
    }
  };

  const loadPlans = async () => {
    try {
      const savedPlans = JSON.parse(await AsyncStorage.getItem('plans') || '[]');
      setPlans(savedPlans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Icon name="add-circle-outline" size={40} color="#007BFF" />
      </TouchableOpacity>
      <Text style={styles.heading}>Planification</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text>{`Moteur: ${item.pumpId}`}</Text>
            <Text>{`Date: ${item.date}`}</Text>
            <Text>{`Heure: ${item.time}`}</Text>
          </View>
        )}
      />
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Ajouter une Planification</Text>
          <TextInput
            style={styles.input}
            placeholder="ID du moteur"
            value={pumpId}
            onChangeText={setPumpId}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Heure (HH:MM)"
            value={time}
            onChangeText={setTime}
          />
          <Button title="Ajouter" onPress={addPlan} />
          <Button title="Annuler" onPress={toggleModal} color="red" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeading: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  planItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default PlanningScreen;
