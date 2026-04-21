import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function ChosenFilter({ filterName, onRemove }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>
        {filterName === "Day" || filterName === "Registrations"
          ? `Sort: ${filterName}`
          : filterName}
      </Text>
      <TouchableOpacity onPress={() => onRemove(filterName)} hitSlop={8}>
        <Text style={styles.removeBtn}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  removeBtn: {
    fontSize: 18,
    color: "#888",
    lineHeight: 20,
  },
});

export default ChosenFilter;
