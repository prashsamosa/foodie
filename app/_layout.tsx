import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="order-summary"
          options={{
            title: 'Order Summary',
            headerStyle: { backgroundColor: '#3B82F6' },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        />
      </Stack>
    </CartProvider>
  );
}
