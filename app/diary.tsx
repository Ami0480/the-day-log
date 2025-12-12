import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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

import CalendarIcon from "../assets/images/calendar-icon.svg";

type Entry = {
  id: string;
  title: string;
  story: string;
  date: Date;
  photo: string[];
};

const STORAGE_KEY = "diary_entries";

export default function Diary() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#D08A54";
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadEntries();
  }, []);

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
      setEntries([...entries, { ...entry, id: String(Date.now()) }]);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    setEditingIndex(null);
  };

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
    if (filterDate) {
      const d = new Date(entry.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const entryDateStr = `${year}-${month}-${day}`;
      if (entryDateStr !== filterDate) return false;
    }

    if (searchText.trim()) {
      const searchWords = searchText
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 0);

      const title = entry.title.toLowerCase();
      const story = entry.story.toLowerCase();
      const dateFormatted = formatDate(entry.date).toLowerCase();
      const allText = `${title} ${story} ${dateFormatted}`;

      const allWordsMatch = searchWords.every((word) => allText.includes(word));

      if (!allWordsMatch) return false;
    }

    return true;
  });

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
      <View className="flex-row justify-center items-center gap-5 py-4 px-8">
        <TouchableOpacity
          onPress={() => {
            setEditingIndex(null);
            setShowForm(true);
          }}
        >
          <View className="bg-[#D08A54] items-center justify-center w-12 h-12 rounded-full">
            <ThemedText className="text-white text-4xl">+</ThemedText>
          </View>
        </TouchableOpacity>

        <View className="flex-1 flex-row py-3 bg-white dark:bg-gray-800 border border-[#D08A54] rounded-lg px-3">
          <TextInput
            className="flex-1 text-black dark:text-white"
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
          {sortedEntries.map((entry) => (
            <View
              key={entry.id}
              className="bg-white w-[340px] h-auto border border-gray-300 rounded-xl p-4 mb-5"
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
                  className="bg-[#D08A54] px-3 py-1 rounded"
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
