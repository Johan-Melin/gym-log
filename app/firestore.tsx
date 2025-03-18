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
        const startTime = Date.now();
        setStatus('Testing Firebase connection...');
        console.log('Starting Firebase connection test:', new Date().toISOString());

        // Check if the database is accessible - no need for any collections to exist
        await getDocs(collection(db, 'test')); // This works even if collection doesn't exist yet

        const endTime = Date.now();
        console.log(`Firebase connection test completed in ${endTime - startTime}ms`);
        setStatus(
          'Firebase connected successfully! ✅\nCreate a document to see it in Firebase Console.'
        );
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
      setStatus(`Document added with ID: ${docRef.id} ✅\nCheck Firebase Console to see it!`);
    } catch (error) {
      console.error('Error adding document:', error);
      setStatus(`Error adding document: ${error.message} ❌`);
    }
  };

  return (
    <View className="gap-4 p-6">
      <Text>{status}</Text>
      <Button variant="secondary" onPress={addTestDocument}>
        <Text>Add Test Document</Text>
      </Button>
    </View>
  );
}
