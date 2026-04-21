import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://recruitments.bits-dvm.org";

function EventCard({ event, addBookmark, bookmarks = [] }) {
  const { id, name, category, day, time, venue, registrations } = event;
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(bookmarks.includes(id));
  }, [bookmarks, id]);

  const toggleBookmark = (eventId) => {
    addBookmark(eventId);
    setBookmarked(!bookmarked);
  };

  const imageUri = `${BASE_URL}/events/${id}/image`;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: imageUri,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <TouchableOpacity
        style={styles.bookmarkBtn}
        onPress={() => toggleBookmark(id)}
      >
        <View style={styles.iconCircle}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={bookmarked ? "#f5b301" : "#fff"}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.details}>
          <View style={styles.row}>
            <Ionicons name="pricetag-outline" size={14} color="#f5b301" />
            <Text style={styles.detail}> {category}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color="#888" />
            <Text style={styles.detail}>
              {" "}
              Day {day} • {time}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={styles.detail}> {venue}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="people-outline" size={14} color="#888" />
            <Text style={styles.detail}> {registrations} registered</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden", // Ensures image corners follow card radius
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee", // Fallback color while loading
  },
  bookmarkBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
  },
  iconCircle: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
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
    color: "#555",
    fontWeight: "500",
  },
});

export default EventCard;
