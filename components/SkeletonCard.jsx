import { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";

const TEAR = require("../assets/tear.png");

export function SkeletonCard() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.outerContainer}>
      <Image
        style={styles.paperclip}
        source={require("../assets/paperclip.png")}
      />

      <View style={styles.card}>
        <View style={styles.redLine} />

        <View style={styles.punchHolesContainer} pointerEvents="none">
          <View style={styles.punchHole} />
          <View style={styles.punchHole} />
          <View style={styles.punchHole} />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Animated.View
              style={[styles.skeletonTitle, { opacity: fadeAnim }]}
            />
            <View style={styles.skeletonBookmark} />
          </View>

          <View style={[styles.titleRow, { marginTop: -4, marginBottom: 16 }]}>
            <Animated.View
              style={[styles.skeletonTitleShort, { opacity: fadeAnim }]}
            />
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <Animated.View
                style={[
                  styles.skeletonDetailText,
                  { width: "55%", opacity: fadeAnim },
                ]}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <Animated.View
                style={[
                  styles.skeletonDetailText,
                  { width: "40%", opacity: fadeAnim },
                ]}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <Animated.View
                style={[
                  styles.skeletonDetailText,
                  { width: "45%", opacity: fadeAnim },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <Image source={TEAR} style={styles.tearImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 12,
  },
  paperclip: {
    zIndex: 5,
    position: "absolute",
    top: -10,
    left: 45,
  },
  tearImage: {
    width: "100%",
    marginTop: -10,
    zIndex: 5,
  },
  redLine: {
    position: "absolute",
    left: 51,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#FF7BAC",
    opacity: 0.3,
    zIndex: 3,
  },
  punchHolesContainer: {
    flexDirection: "column",
    gap: 26,
    position: "absolute",
    zIndex: 3,
    top: 10,
    left: 10,
    paddingTop: 6,
  },
  punchHole: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#161616",
  },
  card: {
    backgroundColor: "#F8EBAA",
    overflow: "hidden",
    position: "relative",
    minHeight: 140,
  },
  body: {
    flex: 1,
    paddingLeft: 78,
    paddingRight: 16,
    paddingVertical: 18,
    zIndex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  skeletonTitle: {
    flex: 1,
    height: 26,
    backgroundColor: "#e3d69c",
    borderRadius: 4,
    marginTop: 4,
  },
  skeletonTitleShort: {
    width: "60%",
    height: 26,
    backgroundColor: "#e3d69c",
    borderRadius: 4,
  },
  skeletonBookmark: {
    width: 20,
    height: 20,
    backgroundColor: "#e3d69c",
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  details: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonIcon: {
    width: 13,
    height: 13,
    backgroundColor: "#e3d69c",
    borderRadius: 3,
    marginRight: 6,
  },
  skeletonDetailText: {
    height: 14,
    backgroundColor: "#e3d69c",
    borderRadius: 3,
  },
});

export default SkeletonCard;
