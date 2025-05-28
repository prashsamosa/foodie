import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FoodItem as FoodItemType } from '../../types';
import { FoodItem } from '../../components/FoodItem';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<FoodItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for menu items
    const unsubscribe = onSnapshot(
      collection(db, 'menuItems'),
      (snapshot) => {
        const items: FoodItemType[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as FoodItemType);
        });
        setMenuItems(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching menu items:', error);
        Alert.alert('Error', 'Failed to load menu items. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderItem = ({ item }: { item: FoodItemType }) => (
    <FoodItem item={item} />
  );

  return (
    <View style={styles.container}>
      {menuItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No menu items available</Text>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280', // text-gray-500
    fontSize: 18,
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
  listContainer: {
    padding: 8,
  },
});
