import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

function FilterOption({ filterName, chooseFilter }) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={() => chooseFilter(filterName)}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{filterName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});

export default FilterOption;
