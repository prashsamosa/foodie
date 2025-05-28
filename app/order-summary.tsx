import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useCart } from '../context/CartContext';

export default function OrderSummaryScreen() {
  const { state, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleConfirmOrder = async () => {
    if (state.items.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: state.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: state.total,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);

      Alert.alert(
        'Order Confirmed!',
        'Your order has been placed successfully. You can track it in the Orders tab.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              router.push('/(tabs)/orders');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Order Summary</Text>

        {state.items.map((item, index) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemRow}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ${item.price.toFixed(2)} each
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        {/* Order Total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${state.total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (8%):</Text>
            <Text style={styles.totalValue}>${(state.total * 0.08).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee:</Text>
            <Text style={styles.totalValue}>$2.99</Text>
          </View>
          <View style={styles.totalDivider}>
            <View style={styles.finalTotalRow}>
              <Text style={styles.finalTotalLabel}>Total:</Text>
              <Text style={styles.finalTotalValue}>
                ${(state.total + (state.total * 0.08) + 2.99).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>Delivery Information</Text>
          <Text style={styles.deliveryText}>Estimated delivery time: 30-45 minutes</Text>
          <Text style={styles.deliveryText}>Delivery address: Your current location</Text>
          <Text style={styles.deliveryText}>Payment method: Cash on delivery</Text>
        </View>
      </ScrollView>

      {/* Confirm Order Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleConfirmOrder}
          disabled={loading}
          style={[styles.confirmButton, loading ? styles.confirmButtonDisabled : styles.confirmButtonEnabled]}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Placing Order...' : 'Confirm Order'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  itemQuantity: {
    color: '#4b5563', // text-gray-600
  },
  itemPrice: {
    color: '#16a34a', // text-green-600
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#bbf7d0', // border-green-200
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    color: '#000',
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // border-gray-200
    paddingTop: 8,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a', // text-green-600
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#000',
  },
  deliveryText: {
    color: '#4b5563', // text-gray-600
    marginBottom: 4,
  },
  buttonContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // border-gray-200
    padding: 16,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 8,
  },
  confirmButtonEnabled: {
    backgroundColor: '#22c55e', // bg-green-500
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af', // bg-gray-400
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
  },
  backButtonText: {
    color: '#374151', // text-gray-700
    fontWeight: '600',
    textAlign: 'center',
  },
});
