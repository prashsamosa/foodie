import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Order } from "../../types";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersList: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "confirmed":
        return styles.statusConfirmed;
      case "delivered":
        return styles.statusDelivered;
      default:
        return styles.statusDefault;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order #{item.id.slice(-8)}</Text>
        <View style={[styles.statusBadge, getStatusColor(item.status)]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.dateText}>
        {new Date(item.timestamp).toLocaleDateString()} at{" "}
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>

      <Text style={styles.itemsText}>
        Items: {item.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
      </Text>

      <Text style={styles.totalText}>Total: ${item.total.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={styles.startOrderButton}
          >
            <Text style={styles.startOrderButtonText}>Start Ordering</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchOrders}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 8,
    padding: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999, // rounded-full
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  statusPending: {
    backgroundColor: "#eab308", // bg-yellow-500
  },
  statusConfirmed: {
    backgroundColor: "#3b82f6", // bg-blue-500
  },
  statusDelivered: {
    backgroundColor: "#22c55e", // bg-green-500
  },
  statusDefault: {
    backgroundColor: "#6b7280", // bg-gray-500
  },
  dateText: {
    color: "#4b5563", // text-gray-600
    marginBottom: 8,
  },
  itemsText: {
    color: "#374151", // text-gray-700
    marginBottom: 8,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16a34a", // text-green-600
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280", // text-gray-500
    fontSize: 18,
    marginBottom: 16,
  },
  startOrderButton: {
    backgroundColor: "#3b82f6", // bg-blue-500
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startOrderButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  listContainer: {
    padding: 8,
  },
});
