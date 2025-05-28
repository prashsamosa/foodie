import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { FoodItem as FoodItemType } from "../types";
import { useCart } from "../context/CartContext";

interface Props {
  item: FoodItemType;
}

export const FoodItem = ({ item }: Props) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!item.available) {
      Alert.alert("Item Unavailable", "This item is currently not available.");
      return;
    }
    addItem(item);
    Alert.alert("Added to Cart", `${item.name} has been added to your cart!`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={!item.available}
          style={[
            styles.button,
            item.available ? styles.buttonAvailable : styles.buttonUnavailable,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              item.available
                ? styles.buttonTextAvailable
                : styles.buttonTextUnavailable,
            ]}
          >
            {item.available ? "Add to Cart" : "Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 8,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 128,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "#4B5563",
    marginBottom: 8,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16A34A",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonAvailable: {
    backgroundColor: "#3B82F6",
  },
  buttonUnavailable: {
    backgroundColor: "#D1D5DB",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  buttonTextAvailable: {
    color: "#fff",
  },
  buttonTextUnavailable: {
    color: "#6B7280",
  },
});
