import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://recruitments.bits-dvm.org";

const DAY_LABELS = {
  0: "Day Zero",
  1: "Day One",
  2: "Day Two",
  3: "Day Three",
};

const CATEGORY_ICONS = {
  Music: "musical-notes-outline",
  Tech: "hardware-chip-outline",
  Cultural: "color-palette-outline",
  Sports: "football-outline",
};

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, name, category, day, time, venue, registrations } = params;

  const imageUri = `${BASE_URL}/events/${id}/image`;
  const categoryIcon = CATEGORY_ICONS[category] ?? "star-outline";
  const dayLabel = DAY_LABELS[day] ?? `Day ${day}`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#f5b301" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: imageUri }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Ionicons name={categoryIcon} size={14} color="#121212" />
              <Text style={styles.badgeText}>{category}</Text>
            </View>
            <Text style={styles.dayLabelText}>{dayLabel}</Text>
          </View>

          <Text style={styles.eventName}>{name}</Text>

          <View style={styles.infoSection}>
            <DetailRow icon="time-outline" label="Time" value={time} />
            <DetailRow icon="location-outline" label="Venue" value={venue} />
            <DetailRow
              icon="people-outline"
              label="Registrations"
              value={`${registrations} Joined`}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color="#f5b301" style={styles.rowIcon} />
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#2a2a2a",
  },
  contentContainer: {
    padding: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5b301",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  badgeText: {
    color: "#121212",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  dayLabelText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  eventName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
  },
  infoSection: {
    gap: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rowIcon: {
    width: 24,
  },
  rowLabel: {
    color: "#666",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  rowValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
});
