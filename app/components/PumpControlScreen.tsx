import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

interface Motor {
  _id: string;
  name: string;
  ref: string;
  status: string;
}

const PumpControlScreen = () => {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [newMotorName, setNewMotorName] = useState('');
  const [motorRef, setMotorRef] = useState('');
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const navigation = useNavigation(); // Initialize useNavigation

  const fetchMotors = async () => {
    try {
      const response = await axios.get('http://192.168.1.35:5000/api/motors');
      const motorsWithCorrectIds = response.data.map((motor: any) => ({
        ...motor,
        id: motor._id,
      }));
      setMotors(motorsWithCorrectIds);
    } catch (error) {
      console.error('Error fetching motors:', error);
    }
  };

  const handleAddMotor = async () => {
    try {
      await axios.post('http://192.168.1.35:5000/api/motors/create', { name: newMotorName, ref: motorRef });
      setNewMotorName('');
      setMotorRef('');
      setAddModalVisible(false);
      fetchMotors();
    } catch (error) {
      console.error('Error adding motor:', error);
    }
  };

  const toggleMotor = async (motorId: string, newStatus: string) => {
    try {
      await axios.post('http://192.168.1.35:5000/api/motors/control', {
        motorId,
        status: newStatus,
      });
      fetchMotors();
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  const handleScheduleSubmit = async () => {
    if (selectedMotor) {
      console.log('Selected Motor ID:', selectedMotor._id);
      console.log('Selected Date:', selectedDate);
  
      const formattedTime = selectedTime.toISOString().split('T')[1].split('.')[0];
  
      console.log('Selected Time:', formattedTime);
      
      try {
        await axios.post('http://192.168.1.35:5000/api/motors/schedule', {
          motorId: selectedMotor._id,
          date: selectedDate,
          heure: formattedTime,
        });
        setScheduleModalVisible(false);
        fetchMotors();
      } catch (error) {
        console.error('Error scheduling motor:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('No motor selected');
    }
  };
  
  useEffect(() => {
    fetchMotors();
  }, []);

  const handleDateConfirm = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (date: Date) => {
    setSelectedTime(date);
    setTimePickerVisibility(false);
  };

  const handleLogout = () => {
    // Clear user session or token
    // Navigate to Login screen
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={30} color="blue" />
      </TouchableOpacity>

      <FlatList
        data={motors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.motorContainer} key={item._id}>
            <Text style={styles.motorName}>{item.name}</Text>
            <Text style={styles.motorRef}>{item.ref}</Text>
            <Text style={styles.motorStatus}>Status: {item.status}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => toggleMotor(item._id, 'on')} style={styles.onButton}>
                <Text style={styles.buttonText}>On</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleMotor(item._id, 'off')} style={styles.offButton}>
                <Text style={styles.buttonText}>Off</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.scheduleButton} onPress={() => { 
                setSelectedMotor(item); 
                setScheduleModalVisible(true); 
              }}>
                <Text style={styles.buttonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

<Modal visible={isAddModalVisible} transparent={true} animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Add New Motor</Text>
    
    {/* Label and Input for Motor Name */}
    <Text style={styles.label}>Motor Name:</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter Motor Name"
      value={newMotorName}
      onChangeText={setNewMotorName}
    />
    
    {/* Label and Input for Motor Ref */}
    <Text style={styles.label}>Motor Ref:</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter Motor Ref"
      value={motorRef}
      onChangeText={setMotorRef}
    />
    
    <TouchableOpacity onPress={handleAddMotor} style={styles.modalButton}>
      <Text style={styles.modalButtonText}>Add Motor</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.modalButton}>
      <Text style={styles.modalButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>


      <Modal visible={isScheduleModalVisible} transparent={true} animationType="slide" onRequestClose={() => setScheduleModalVisible(false)}>
        <View style={styles.modalContent}>
          {selectedMotor ? (
            <>
              <Text style={styles.text}>Motor Name: {selectedMotor.name}</Text>
            </>
          ) : (
            <Text style={styles.text}>No motor selected</Text>
          )}
          <Text style={styles.text} onPress={() => setDatePickerVisibility(true)}>
            {selectedDate ? `Date: ${selectedDate}` : 'Select Date'}
          </Text>
          <Text style={styles.text} onPress={() => setTimePickerVisibility(true)}>
            {selectedTime ? `Time: ${('0' + selectedTime.getHours()).slice(-2)}:${('0' + selectedTime.getMinutes()).slice(-2)}` : 'Select Time'}
          </Text>
          <Calendar
            onDayPress={(day) => handleDateConfirm(new Date(day.dateString))}
            markedDates={{ [selectedDate]: { selected: true, marked: true } }}
            hideArrows={false}
            hideExtraDays={true}
          />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => setTimePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <TouchableOpacity onPress={handleScheduleSubmit} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScheduleModalVisible(false)} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('His')}>
  <Text style={styles.footerButtonText}>Historique</Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
          <Text style={styles.footerButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  marginTop:40,
    padding: 20,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  motorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  motorName: {
    fontSize: 16,
  },
  motorRef: {
    fontSize: 14,
    color: 'gray',
  },
  motorStatus: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  offButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  scheduleButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  footerButton: {
    padding: 10,
    borderRadius: 5,
  },
  footerButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default PumpControlScreen;
