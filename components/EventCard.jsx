import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TEAR = require("../assets/tear.png");

function NoteBookBG() {
  const horizontalLines = Array.from({ length: 13 });
  const verticalLines = Array.from({ length: 22 });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={styles.gridOverlay}>
        {horizontalLines.map((_, index) => (
          <View key={`horizontal-${index}`} style={styles.horizontalLine} />
        ))}
      </View>

      <View style={[styles.gridOverlay, { flexDirection: "row" }]}>
        {verticalLines.map((_, index) => (
          <View key={`vertical-${index}`} style={styles.verticalLine} />
        ))}
      </View>

      <View style={styles.redLine} />
    </View>
  );
}

function EventCard({ event, addBookmark, bookmarks = [] }) {
  const { id, name, category, day, time, venue, registrations } = event;
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setBookmarked(bookmarks.includes(id));
  }, [bookmarks, id]);

  function toggleBookmark(e) {
    e.stopPropagation?.();
    addBookmark(id);
    setBookmarked((prev) => !prev);
  }

  function handlePress() {
    router.push({
      pathname: "/event/[id]",
      params: {
        id,
        name,
        category,
        day,
        time,
        venue,
        registrations,
      },
    });
  }

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.88}
      >
        <NoteBookBG />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {name}
            </Text>
            <TouchableOpacity
              style={styles.bookmarkBtn}
              onPress={toggleBookmark}
              hitSlop={10}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={bookmarked ? "#1a1a1a" : "#1a1a1a"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={13} color="#1a1a1a" />
              <Text style={styles.detail}>
                {" "}
                Day {day} • {time}
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="location-outline" size={13} color="#1a1a1a" />
              <Text style={styles.detail}> {venue}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="people-outline" size={13} color="#1a1a1a" />
              <Text style={styles.detail}> {registrations} registered</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Image source={TEAR} style={styles.tearImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 12,
  },
  tearImage: {
    width: "100%",
    marginTop: -10,
    zIndex: 2,
  },
  card: {
    backgroundColor: "#F8EBAA",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    opacity: 0.25,
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#76BFC7",
  },
  verticalLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#76BFC7",
  },
  redLine: {
    position: "absolute",
    left: 32,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#FF7BAC",
    opacity: 0.6,
  },
  body: {
    flex: 1,
    paddingLeft: 38,
    paddingRight: 16,
    paddingVertical: 18,
    zIndex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 34,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  bookmarkBtn: {
    marginLeft: 8,
    marginTop: 4,
  },
  details: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  detail: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
  },
});

export default EventCard;
