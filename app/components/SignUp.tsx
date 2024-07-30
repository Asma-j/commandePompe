import React, { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import axios, { AxiosError } from 'axios';

const SignUp = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  // UseEffect to run some code on component mount or when email/password changes
  useEffect(() => {
    // This code runs when the component mounts or when email/password changes
    console.log('Component mounted or email/password changed');
    
    // Cleanup function (if needed) can be returned here
    return () => {
      console.log('Cleanup or unmount');
    };
  }, [email, password]); // Dependencies array

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      await axios.post('http://192.168.1.35:5000/api/users/register', { email, password });
      console.log('User account created & signed in!');
      navigation.navigate('Login');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        console.log(axiosError.response.data);
        setError('An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./img/p.jpg')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink} onPress={handleSignIn}>Sign In</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  signInText: {
    marginTop: 20,
    textAlign: 'center',
  },
  signInLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
