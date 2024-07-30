import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import axios, { AxiosError } from 'axios';

const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.35:5000/api/users/login', { email, password });
      console.log('User signed in!', response.data);
      navigation.navigate('PumpControlScreen');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        setError('An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./img/p.jpg')} // Ajustez le chemin selon votre structure de projet
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
      <Button title="Sign In" onPress={handleSignIn} />
      <Text style={styles.signUpText}>
        Don't have an account? <Text style={styles.signUpLink} onPress={handleSignUp}>Sign Up</Text>
      </Text>
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
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
  },
  signUpLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default Login;
