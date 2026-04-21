import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import EventCard from "./components/EventCard";
import FilterOption from "./components/FilterOption";
import ChosenFilter from "./components/ChosenFilter";
import SkeletonCard from "./components/SkeletonCard";

const BASE_URL = "https://recruitments.bits-dvm.org";
const HEADER_IMAGE = require("./assets/header-image.jpg");
const BG_IMAGE = require("./assets/background.png");

export default function App() {
  const [loaded] = useFonts({
    MilordBook: require("./assets/fonts/MilordBook.ttf"),
  });
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setErrorFlag] = useState(false);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

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

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorFlag(false);

    try {
      let url = `${BASE_URL}/events/search?`;
      const params = new URLSearchParams();

      if (debouncedSearch) params.append("q", debouncedSearch);
      const activeCategory = filters.find((f) => categories.includes(f));
      if (activeCategory) params.append("category", activeCategory);
      const dayFilter = filters.find((f) => !isNaN(f));
      if (dayFilter) params.append("day", dayFilter);

      const response = await axios.get(url + params.toString());
      let data = response.data;
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

  useEffect(() => {
    AsyncStorage.getItem("bookmarks").then((stored) => {
      if (stored) setBookmarks(JSON.parse(stored));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  function chooseFilter(filterName) {
    const sortFilters = ["Day", "Registrations"];
    setFilters((prev) => {
      let updated = [...prev];
      if (sortFilters.includes(filterName)) {
        updated = updated.filter((f) => !sortFilters.includes(f));
      }
      if (categories.includes(filterName)) {
        updated = updated.filter((f) => !categories.includes(f));
      }
      if (!updated.includes(filterName)) updated.push(filterName);
      return updated;
    });
  }

  function addBookmark(id) {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  }

  const bookmarkedEvents = bookmarks
    .map((id) => events.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={BG_IMAGE}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <StatusBar barStyle="light-content" />
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Events</Text>
            <TouchableOpacity
              style={styles.bookmarkHeaderBtn}
              onPress={() => setIsBookmarksOpen(true)}
            >
              <Ionicons name="bookmark" size={20} color="#fff" />
              {bookmarks.length > 0 && (
                <View style={styles.bookmaskBadge}>
                  <Text style={styles.bookmaskBadgeText}>
                    {bookmarks.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

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
              <Ionicons name="filter" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {filters.length > 0 && (
            <View style={styles.filtersRow}>
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

          {isLoading ? (
            <FlatList
              data={[1, 2, 3]}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.list}
              renderItem={() => <SkeletonCard />}
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

          <Modal
            visible={isFilterOpen}
            animationType="slide"
            transparent
            onRequestClose={() => setIsFilterOpen(false)}
          >
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={() => setIsFilterOpen(false)}
            />
            <View style={styles.drawerPanel}>
              <View style={styles.drawerHandle} />
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Filter & Sort</Text>
                <TouchableOpacity onPress={() => setIsFilterOpen(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                <Text style={styles.filterLabel}>Categories</Text>
                {categories.map((cat) => (
                  <FilterOption
                    key={cat}
                    filterName={cat}
                    chooseFilter={chooseFilter}
                  />
                ))}
                <Text style={styles.filterLabel}>Sort by</Text>
                <FilterOption filterName="Day" chooseFilter={chooseFilter} />
                <FilterOption
                  filterName="Registrations"
                  chooseFilter={chooseFilter}
                />
              </ScrollView>
              {filters.length > 0 && (
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => setFilters([])}
                >
                  <Text style={styles.clearBtnText}>Clear All Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </Modal>

          <Modal
            visible={isBookmarksOpen}
            animationType="slide"
            transparent
            onRequestClose={() => setIsBookmarksOpen(false)}
          >
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={() => setIsBookmarksOpen(false)}
            />
            <View style={styles.drawerPanel}>
              <View style={styles.drawerHandle} />
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Bookmarks</Text>
                <TouchableOpacity onPress={() => setIsBookmarksOpen(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.bookmarkContent}>
                {bookmarkedEvents.length === 0 ? (
                  <Text style={styles.emptyText}>No bookmarks yet.</Text>
                ) : (
                  bookmarkedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      bookmarks={bookmarks}
                      addBookmark={addBookmark}
                    />
                  ))
                )}
              </ScrollView>
            </View>
          </Modal>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#212121",
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    resizeMode: "cover",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  headerTitle: {
    fontFamily: "MilordBook",
    fontSize: 50,
    color: "#fff",
    paddingTop: 10,
    // letterSpacing: 1,
  },
  bookmarkHeaderBtn: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 10,
    // borderWidth: 1,
    // borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e1e1e",
  },
  filterToggleBtn: {
    marginLeft: 10,
    backgroundColor: "#f5b301",
    borderRadius: 8,
    padding: 7,
  },
  bookmaskBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#dcdcdc",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmaskBadgeText: {
    color: "#2d2d2d",
    fontSize: 10,
    fontWeight: "700",
  },

  filtersRow: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },

  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 15,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawerPanel: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "75%",
    paddingBottom: 30,
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e1e1e",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 4,
  },
  clearBtn: {
    marginTop: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#e53935",
    fontWeight: "600",
    fontSize: 15,
  },
  bookmarkContent: {
    paddingVertical: 8,
  },
});
