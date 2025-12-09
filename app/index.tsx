import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { CalendarView } from "../components/CalendarView";
import { NewEntry } from "../components/new-entry";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { logOut } from "../src/auth/authMethods";

import AddIcon from "../assets/images/add-icon.svg";
import CalendarIcon from "../assets/images/calendar-icon.svg";

type Entry = {
  id: string;
  title: string;
  story: string;
  date: Date;
  photo: string[];
};

const STORAGE_KEY = "diary_entries";

export default function Index() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#000000";
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries from storage on app start
  useEffect(() => {
    loadEntries();
  }, []);

  // Save entries to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveEntries();
    }
  }, [entries]);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }));
        setEntries(entriesWithDates);
      }
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveEntries = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving entries:", error);
    }
  };

  const handleSave = (entry: Entry) => {
    if (editingIndex !== null) {
      const updatedEntries = [...entries];
      updatedEntries[editingIndex] = entry;
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      // Add new entry
      setEntries([...entries, { ...entry, id: String(Date.now()) }]);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    setEditingIndex(null);
  };

  // Get all entry dates in YYYY-MM-DD format
  const entryDates = entries.map((entry) => {
    const d = new Date(entry.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredEntries = entries.filter((entry) => {
    // Date filter
    if (filterDate) {
      const d = new Date(entry.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const entryDateStr = `${year}-${month}-${day}`;
      if (entryDateStr !== filterDate) return false;
    }

    // Search filter
    if (searchText.trim()) {
      const searchWords = searchText
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 0);

      // Get searchable text from entry
      const title = entry.title.toLowerCase();
      const story = entry.story.toLowerCase();
      const dateFormatted = formatDate(entry.date).toLowerCase(); // "6 dec 2025"
      const allText = `${title} ${story} ${dateFormatted}`;

      // Check if ALL search words are found
      const allWordsMatch = searchWords.every((word) => allText.includes(word));

      if (!allWordsMatch) return false;
    }

    return true;
  });

  // Sort filtered entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDateSelect = (date: string) => {
    setFilterDate(date);
  };

  const clearFilters = () => {
    setFilterDate(null);
    setSearchText("");
  };

  return (
    <ThemedView>
      {/* Search Bar */}
      <View className="flex-row items-center px-4 pt-4 mb-6 gap-3">
        <View className="flex-1 flex-row items-center bg-white dark:bg-gray-800 border border-gray-300 rounded-lg px-3">
          <TextInput
            className="flex-1 py-3 text-black dark:text-white"
            placeholder="Search by title, story, date..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <ThemedText className="text-gray-400 text-lg">✕</ThemedText>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <CalendarIcon width={40} height={40} fill={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={logOut} className="absolute top-4 left-4">
          <ThemedText className="text-orange-400">Logout</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Show filter indicator */}
      {(filterDate || searchText) && (
        <View className="flex-row justify-center items-center my-2 px-4">
          <ThemedText className="text-gray-500 text-sm">
            {filterDate && `Date: ${filterDate}`}
            {filterDate && searchText && " | "}
            {searchText && `Search: "${searchText}"`}
          </ThemedText>
          <TouchableOpacity
            className="ml-2 bg-gray-200 px-2 py-1 rounded"
            onPress={clearFilters}
          >
            <ThemedText className="text-sm">Clear All</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* No results message */}
      {filteredEntries.length === 0 && (searchText || filterDate) && (
        <View className="flex-1 justify-center items-center">
          <ThemedText className="text-gray-500">No entries found</ThemedText>
        </View>
      )}

      <ScrollView className="flex-1">
        <View className="flex items-center">
          {sortedEntries.map((entry, index) => (
            <View
              key={index}
              className="bg-white w-80 h-auto border border-gray-300 rounded-xl p-4 mb-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <ThemedText className="text-gray-500 text-sm">
                  {formatDate(entry.date)}
                </ThemedText>
                <TouchableOpacity
                  className="bg-orange-300 px-3 py-1 rounded"
                  onPress={() => {
                    const originalIndex = entries.findIndex(
                      (e) => e.id === entry.id
                    );
                    setEditingIndex(originalIndex);
                    setTimeout(() => setShowForm(true), 10);
                  }}
                >
                  <ThemedText className="text-white text-sm">Edit</ThemedText>
                </TouchableOpacity>
              </View>
              <ThemedText className="font-semibold text-2xl mb-5 border-b">
                {entry.title}
              </ThemedText>

              {entry.photo && entry.photo.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  <View className="flex-row gap-2">
                    {entry.photo.map((uri, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => setSelectedPhoto(uri)}
                      >
                        <Image
                          source={{ uri }}
                          className="w-32 h-32 rounded-lg"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
              <ThemedText>{entry.story}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-6"
        onPress={() => {
          setEditingIndex(null);
          setShowForm(true);
        }}
      >
        <AddIcon width={40} height={40} fill={iconColor} />
      </TouchableOpacity>

      <Modal visible={selectedPhoto !== null} transparent animationType="fade">
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            className="absolute top-12 right-4 z-10 bg-white/20 rounded-full w-10 h-10 items-center justify-center"
            onPress={() => setSelectedPhoto(null)}
          >
            <ThemedText className="text-white text-xl">✕</ThemedText>
          </TouchableOpacity>

          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto }}
              className="w-3/4 h-96 rounded-lg"
              resizeMode="cover"
            />
          )}
        </View>
      </Modal>

      <CalendarView
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        entryDates={entryDates}
        onDateSelect={handleDateSelect}
      />

      <NewEntry
        visible={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingIndex(null);
        }}
        onSave={handleSave}
        onDelete={() => {
          if (editingIndex !== null) {
            deleteEntry(entries[editingIndex].id);
            setShowForm(false);
          }
        }}
        initialData={editingIndex !== null ? entries[editingIndex] : undefined}
      />
    </ThemedView>
  );
}
