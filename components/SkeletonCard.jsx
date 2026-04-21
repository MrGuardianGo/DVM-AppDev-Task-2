import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const SkeletonCard = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const sharedAnimation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 800,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(sharedAnimation).start();
  }, [pulseAnim]);

  const animatedStyle = { opacity: pulseAnim };

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.imagePlaceholder, animatedStyle]} />

      <View style={styles.textContainer}>
        <Animated.View style={[styles.titlePlaceholder, animatedStyle]} />

        <View style={styles.details}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.row}>
              <Animated.View style={[styles.iconPlaceholder, animatedStyle]} />
              <Animated.View
                style={[
                  styles.detailPlaceholder,
                  animatedStyle,
                  { width: i % 2 === 0 ? "60%" : "45%" },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#e1e1e1",
  },
  textContainer: {
    padding: 16,
  },
  titlePlaceholder: {
    width: "70%",
    height: 22,
    backgroundColor: "#e1e1e1",
    borderRadius: 4,
    marginBottom: 12,
  },
  details: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 14,
    height: 14,
    backgroundColor: "#e1e1e1",
    borderRadius: 7,
    marginRight: 8,
  },
  detailPlaceholder: {
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
});

export default SkeletonCard;
