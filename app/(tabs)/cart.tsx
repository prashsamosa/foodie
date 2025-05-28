import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../components/CartItem';

export default function CartScreen() {
  const { state, clearCart } = useCart();

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart }
      ]
    );
  };

  const handleProceedToCheckout = () => {
    if (state.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before proceeding.');
      return;
    }
    router.push('/order-summary');
  };

  const renderItem = ({ item }: { item: any }) => (
    <CartItem item={item} />
  );

  return (
    <View style={styles.container}>
      {state.items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            style={styles.browseButton}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={state.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Cart Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.totalItemsText}>Total Items: {state.items.length}</Text>
              <Text style={styles.totalText}>
                ${state.total.toFixed(2)}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleClearCart}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleProceedToCheckout}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280', // text-gray-500
    fontSize: 18, // text-lg
    marginBottom: 16, // mb-4
  },
  browseButton: {
    backgroundColor: '#3b82f6', // bg-blue-500
    paddingHorizontal: 24, // px-6
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-lg
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // border-gray-200
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalItemsText: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a', // text-green-600
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // space-x-3
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ef4444', // bg-red-500
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-lg
    marginRight: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#22c55e', // bg-green-500
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-lg
    marginLeft: 6,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
