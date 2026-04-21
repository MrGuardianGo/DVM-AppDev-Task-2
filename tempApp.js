import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // Ensure axios is installed
import EventCard from "./components/EventCard";
import FilterOption from "./components/FilterOption";
import ChosenFilter from "./components/ChosenFilter";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_URL = "https://lillie-nondoubtable-hellishly.ngrok-free.dev";
const HEADER_IMAGE = require("./assets/header-image.jpg");

export default function App() {
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search and Debounce
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setErrorFlag] = useState(false);

  // 1. Debounce Search Input: Wait 500ms after user stops typing to trigger API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 2. Fetch Categories once on mount (to populate the filter drawer)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/events`);
        const uniqueCategories = [...new Set(res.data.map((e) => e.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadInitialData();
  }, []);

  // 3. Main Data Fetcher: Triggered by filters or debounced search
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorFlag(false);

    try {
      let url = `${BASE_URL}/events/search?`;
      const params = new URLSearchParams();

      if (debouncedSearch) params.append("q", debouncedSearch);

      // Extract category from filters (assuming one category at a time based on API docs)
      const activeCategory = filters.find((f) => categories.includes(f));
      if (activeCategory) params.append("category", activeCategory);

      // Extract day from filters (if your UI passes a day number)
      const dayFilter = filters.find((f) => !isNaN(f));
      if (dayFilter) params.append("day", dayFilter);

      const response = await axios.get(url + params.toString());
      let data = response.data;

      // 4. Client-side Sorting (Since API doesn't provide sort params)
      if (filters.includes("Day")) {
        data.sort((a, b) => a.day - b.day);
      } else if (filters.includes("Registrations")) {
        data.sort((a, b) => b.registrations - a.registrations);
      }

      setEvents(data);
    } catch (error) {
      console.error(error);
      setErrorFlag(true);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters, categories]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --- Persistence Logic ---
  useEffect(() => {
    AsyncStorage.getItem("bookmarks").then((stored) => {
      if (stored) setBookmarks(JSON.parse(stored));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // --- Handlers ---
  function chooseFilter(filterName) {
    const sortFilters = ["Day", "Registrations"];
    setFilters((prev) => {
      let updated = [...prev];
      // If picking a sort, remove other sorts
      if (sortFilters.includes(filterName)) {
        updated = updated.filter((f) => !sortFilters.includes(f));
      }
      // If picking a category, replace existing category
      if (categories.includes(filterName)) {
        updated = updated.filter((f) => !categories.includes(f));
      }
      if (!updated.includes(filterName)) updated.push(filterName);
      return updated;
    });
  }

  const addBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  const bookmarkedEvents = bookmarks
    .map((id) => events.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={HEADER_IMAGE}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerOverlay} />
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity
          style={styles.bookmarkHeaderBtn}
          onPress={() => setIsBookmarksOpen(true)}
        >
          <Ionicons name="bookmark" size={20} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.searchRow}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an event..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterToggleBtn}
          onPress={() => setIsFilterOpen(true)}
        >
          <Ionicons name="options-outline" size={20} color="#fff" />
          {filters.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filters.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Chips Row */}
      {filters.length > 0 && (
        <View style={styles.chipsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((f) => (
              <ChosenFilter
                key={f}
                filterName={f}
                onRemove={(name) =>
                  setFilters((prev) => prev.filter((i) => i !== name))
                }
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main List */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#f5b301"
          style={{ marginTop: 50 }}
        />
      ) : hasError ? (
        <Text style={styles.emptyText}>
          Something went wrong fetching events.
        </Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events found :(</Text>
          }
          renderItem={({ item }) => (
            <EventCard
              event={item}
              bookmarks={bookmarks}
              addBookmark={addBookmark}
            />
          )}
        />
      )}

      {/* Filter Modal and Bookmarks Modal remain largely same, just calling chooseFilter */}
      {/* ... (Modal code from your original snippet) ... */}
    </SafeAreaView>
  );
}

// ... (Styles remain the same)
