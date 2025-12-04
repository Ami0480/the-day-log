import { useState } from "react";
import {
  Image,
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
  date: Date;
  photo: string[];
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
              className="bg-white w-80 h-auto border border-gray-300 rounded-xl p-4 mb-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <ThemedText className="text-gray-500 text-sm mb-2">
                {entry.date.toLocaleDateString()}
              </ThemedText>
              <ThemedText className="font-semibold text-3xl mb-5 border-b">
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
                      <Image
                        key={i}
                        source={{ uri }}
                        className="w-32 h-32 rounded-lg"
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
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
