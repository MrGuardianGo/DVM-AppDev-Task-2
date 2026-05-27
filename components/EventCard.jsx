import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TEAR = require("../assets/tear.png");
const GRIDTILE = require("../assets/grid-tile.png");

// function NoteBookBG({ width, height }) {
//   if (!width || !height) return null;

//   const LINE_SPACING = 15;
//   const horizontalCount = Math.floor(height / LINE_SPACING);

//   // FIXED: Calculate vertical lines relative to the space available *after* the red line margins
//   const START_OFFSET = 50;
//   const verticalCount = Math.floor((width - START_OFFSET) / LINE_SPACING);

//   const horizontalLines = Array.from({ length: horizontalCount });
//   const verticalLines = Array.from({ length: verticalCount });

//   return (
//     <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
//       {/* Horizontal Lines */}
//       <View style={styles.gridOverlay}>
//         {horizontalLines.map((_, index) => (
//           <View
//             key={`horizontal-${index}`}
//             style={[
//               styles.horizontalLine,
//               { position: "absolute", top: index * LINE_SPACING },
//             ]}
//           />
//         ))}
//       </View>

//       <View style={styles.gridOverlay}>
//         {verticalLines.map((_, index) => (
//           <View
//             key={`vertical-${index}`}
//             style={[
//               styles.verticalLine,
//               {
//                 position: "absolute",
//                 left: START_OFFSET + index * LINE_SPACING,
//               },
//             ]}
//           />
//         ))}
//       </View>

//       <View style={styles.redLine} />
//     </View>
//   );
// }

function PunchHoles({ cardHeight }) {
  if (!cardHeight) return null;

  const HOLE_SIZE = 20;
  const GAP = 26;
  const TOP_PADDING = 10;
  const BOTTOM_PADDING = 10;

  const availableHeight = cardHeight - TOP_PADDING - BOTTOM_PADDING;

  const count = Math.max(
    1,
    Math.floor((availableHeight + GAP) / (HOLE_SIZE + GAP)),
  );

  const holes = Array.from({ length: count });

  return (
    <View style={styles.punchHolesContainer} pointerEvents="none">
      {holes.map((_, index) => (
        <View key={`hole-${index}`} style={styles.punchHole} />
      ))}
    </View>
  );
}

function EventCard({ event, addBookmark, bookmarks = [] }) {
  const { id, name, category, day, time, venue, registrations } = event;
  const [bookmarked, setBookmarked] = useState(false);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

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
      params: { id, name, category, day, time, venue, registrations },
    });
  }

  return (
    <View style={styles.outerContainer}>
      <Image
        style={styles.paperclip}
        source={require("../assets/paperclip.png")}
      />
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.88}
      >
        <View style={styles.redLine} />
        <PunchHoles cardHeight={cardDimensions.height} />

        <ImageBackground
          source={GRIDTILE}
          resizeMode="repeat"
          resizeMethod="scale"
          style={styles.repeatingImage}
        />
        <View
          style={styles.body}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCardDimensions({ width, height });
          }}
        >
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
                color="#1a1a1a"
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
  repeatingImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1000,
    height: 1000,
    opacity: 1,
  },
  redLine: {
    position: "absolute",
    left: 51,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#FF7BAC",
    opacity: 0.6,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
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
  title: {
    flex: 1,
    fontSize: 34,
    fontWeight: "800",
    color: "#1a1a1a",
    fontFamily: "Futurbdcn",
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
