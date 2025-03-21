import { Stack, Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>
        <Link href="/nativewindui-examples" style={{ marginBottom: 8 }}>
          <Text>Nativewind UI Examples</Text>
        </Link>
        <Link href="/firestore" style={{ marginBottom: 8 }}>
          <Text>FireStore test</Text>
        </Link>
        <Link href="/auth" style={{ marginBottom: 8 }}>
          <Text>Auth test</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
