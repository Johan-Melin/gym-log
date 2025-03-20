import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

import { auth } from '~/lib/firebase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.textInput}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.textInput}
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.text}>Make Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
