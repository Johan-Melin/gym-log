import { Stack } from 'expo-router';
import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { db, auth } from '~/lib/firebase';

type TestDocument = {
  id: string;
  message: string;
  timestamp: Timestamp;
  userId: string;
};

export default function Home() {
  const [status, setStatus] = useState('');
  const [documents, setDocuments] = useState<TestDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      if (!currentUser) {
        setStatus('You must be logged in to view your documents');
        setLoading(false);
        return;
      }

      setStatus('Fetching your documents...');

      // Add a where clause to only get documents created by the current user
      const q = query(
        collection(db, 'test'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const docsArray: TestDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        docsArray.push({
          id: doc.id,
          message: data.message || '',
          timestamp: data.timestamp,
          userId: data.userId || '',
        });
      });

      setDocuments(docsArray);
      setStatus(`Fetched ${docsArray.length} of your documents ✅`);
    } catch (error) {
      console.error('Firebase error:', error);
      if (error instanceof Error) {
        setStatus(`Firebase error: ${error.message} ❌`);
      } else {
        setStatus('An unknown error occurred ❌');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const addTestDocument = async () => {
    try {
      if (!currentUser) {
        setStatus('You must be logged in to add documents');
        return;
      }

      setStatus('Adding test document...');
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Hello Firebase!',
        timestamp: new Date(),
        userId: currentUser.uid,
      });
      setStatus(`Document added with ID: ${docRef.id} ✅`);

      fetchData();
    } catch (error) {
      console.error('Error adding document:', error);
      setStatus(`Error adding document: ${error} ❌`);
    }
  };

  const deleteDocument = async (docId: string) => {
    try {
      setStatus('Deleting document...');
      const docRef = doc(db, 'test', docId);
      await deleteDoc(docRef);
      setStatus(`Document deleted successfully ✅`);
      fetchData();
    } catch (error) {
      console.error('Error deleting document:', error);
      setStatus(`Error deleting document: ${error} ❌`);
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Firestore Test' }} />
      <View className="flex-1 p-6">
        <Button variant="secondary" onPress={addTestDocument} className="mb-4">
          <Text>Add Test Document</Text>
        </Button>

        <Button variant="secondary" onPress={() => fetchData()} className="mb-4">
          <Text>Refresh Documents</Text>
        </Button>

        <Text variant="caption1" className="mb-4">
          {status}
        </Text>

        <Text variant="heading" className="mb-2">
          Test Documents:
        </Text>
        {loading ? (
          <Text>Loading documents...</Text>
        ) : documents.length > 0 ? (
          <ScrollView
            className="flex-1"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {documents.map((doc) => (
              <View key={doc.id} className="mb-4 rounded-lg border border-border bg-card p-4">
                <View className="flex-row items-center justify-between">
                  <Text variant="subhead" className="font-medium">
                    ID: {doc.id}
                  </Text>
                  <Button
                    variant="plain"
                    onPress={() => deleteDocument(doc.id)}
                    className="bg-destructive/10 rounded-md px-2 py-1">
                    <Text className="text-destructive">Delete</Text>
                  </Button>
                </View>
                <Text className="mt-1">{doc.message}</Text>
                <Text variant="caption1" className="mt-2 text-muted-foreground">
                  {formatTimestamp(doc.timestamp)}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>No documents found. Add your first document!</Text>
        )}
      </View>
    </>
  );
}
