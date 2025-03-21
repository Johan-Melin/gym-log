import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, SafeAreaView, View } from 'react-native';

import { auth } from '~/lib/firebase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userStatus, setUserStatus] = useState('Not signed in');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserStatus(`Signed in as: ${user.email || 'Unknown Email'}`);
      } else {
        setUserStatus('Not signed in');
      }
    });

    return () => unsubscribe();
  }, []);

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

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.log(error);
      alert('Sign out failed: ' + error.message);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>user: {userStatus}</Text>
      </View>
      <Text>Login</Text>
      <TextInput placeholder="email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!auth.currentUser ? (
        <View>
          <TouchableOpacity onPress={signIn}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signUp}>
            <Text>Make Account</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity onPress={signOut}>
            <Text>SignOut</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
