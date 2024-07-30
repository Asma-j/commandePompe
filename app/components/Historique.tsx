import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface Schedule {
  _id: string;
  name: string;
  heure: string;
  date: string;
}

const Historique = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const navigation = useNavigation();

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://192.168.1.35:5000/api/motors');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <View style={styles.container}>


      <FlatList
        data={schedules}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>Time: {item.heure}</Text>
            <Text style={styles.cardText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'blue',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Historique;
