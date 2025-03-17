import { collection, getDocs, addDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { db } from '~/lib/firebase';

export default function Home() {
  const [status, setStatus] = useState('Testing Firebase connection...');

  // Test Firebase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch a document
        await getDocs(collection(db, 'test'));
        setStatus('Firebase connected successfully! ✅');
      } catch (error) {
        console.error('Firebase error:', error);
        setStatus(`Firebase error: ${error.message} ❌`);
      }
    };

    testConnection();
  }, []);

  // Function to add a test document
  const addTestDocument = async () => {
    try {
      setStatus('Adding test document...');
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Hello Firebase!',
        timestamp: new Date(),
      });
      setStatus(`Document added with ID: ${docRef.id} ✅`);
    } catch (error) {
      console.error('Error adding document:', error);
      setStatus(`Error adding document: ${error.message} ❌`);
    }
  };

  return (
    <View className="gap-4">
      <Text>{status}</Text>
      <Button onPress={addTestDocument}>
        <Text className="text-white">Add Test Document</Text>
      </Button>
    </View>
  );
}
