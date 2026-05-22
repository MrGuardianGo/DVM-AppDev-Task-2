import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
    >
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
              color={bookmarked ? "#f5b301" : "#bbb"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={13} color="#888" />
            <Text style={styles.detail}>
              {" "}
              Day {day} • {time}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={13} color="#888" />
            <Text style={styles.detail}> {venue}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="people-outline" size={13} color="#888" />
            <Text style={styles.detail}> {registrations} registered</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryPill: {
    width: 36,
    alignSelf: "stretch",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
    flexDirection: "column",
  },
  categoryText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    writingDirection: "ltr",
    transform: [{ rotate: "90deg" }],
    width: 60,
    textAlign: "center",
    marginTop: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    lineHeight: 21,
  },
  bookmarkBtn: {
    marginLeft: 8,
    marginTop: 1,
  },
  details: {
    gap: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  detail: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  chevron: {
    paddingRight: 10,
  },
});

export default EventCard;
