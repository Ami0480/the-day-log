import { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { NewEntry } from "../components/new-entry";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";

import AddIcon from "../assets/images/add-icon.svg";
import HamburgerIcon from "../assets/images/hamburger-icon.svg";

type Entry = {
  title: string;
  story: string;
};

export default function Index() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  const handleSave = (entry: Entry) => {
    setEntries([...entries, entry]);
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

        <HamburgerIcon width={50} height={50} fill={iconColor} />
      </View>

      <ScrollView className="flex-1">
        <View className="flex items-center">
          {entries.map((entry, index) => (
            <View
              key={index}
              className="bg-white w-80 h-auto border border-gray-300 rounded-lg p-4 mb-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <ThemedText className="font-semibold text-3xl mb-5 border-b">
                {entry.title}
              </ThemedText>
              <ThemedText>{entry.story}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      <NewEntry
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />
    </ThemedView>
  );
}
