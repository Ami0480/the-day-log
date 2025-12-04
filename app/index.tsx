import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { CalendarView } from "../components/CalendarView";
import { NewEntry } from "../components/new-entry";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";

import AddIcon from "../assets/images/add-icon.svg";
import HamburgerIcon from "../assets/images/hamburger-icon.svg";

type Entry = {
  title: string;
  story: string;
  date: Date;
  photo: string[];
};

export default function Index() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#000000";
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const handleSave = (entry: Entry) => {
    if (editingIndex !== null) {
      const updatedEntries = [...entries];
      updatedEntries[editingIndex] = entry;
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      // Add new entry
      setEntries([...entries, entry]);
    }
  };

  // Get all entry dates in YYYY-MM-DD format
  const entryDates = entries.map((entry) => {
    const d = new Date(entry.date);
    return d.toISOString().split("T")[0];
  });

  // Filter entries by selected date
  const filteredEntries = filterDate
    ? entries.filter((entry) => {
        const d = new Date(entry.date);
        return d.toISOString().split("T")[0] === filterDate;
      })
    : entries;

  const handleDateSelect = (date: string) => {
    setFilterDate(date);
  };
  return (
    <ThemedView>
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity
          className="flex justify-center"
          onPress={() => setShowForm(true)}
        >
          <AddIcon width={40} height={40} fill={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <HamburgerIcon width={50} height={50} fill={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Show filter indicator */}
      {filterDate && (
        <View className="flex-row justify-center items-center mb-2">
          <ThemedText className="text-gray-500">
            Showing entries for {filterDate}
          </ThemedText>
          <TouchableOpacity
            className="ml-2 bg-gray-200 px-2 py-1 rounded"
            onPress={() => setFilterDate(null)}
          >
            <ThemedText className="text-sm">Clear</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1">
        <View className="flex items-center">
          {filteredEntries.map((entry, index) => (
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
                <ThemedText className="text-gray-500 text-sm mb-2">
                  {entry.date.toLocaleDateString()}
                </ThemedText>
                <TouchableOpacity
                  className="bg-orange-300 px-3 py-1 rounded"
                  onPress={() => {
                    const originalIndex = entries.indexOf(entry);
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
        initialData={editingIndex !== null ? entries[editingIndex] : undefined}
      />
    </ThemedView>
  );
}
