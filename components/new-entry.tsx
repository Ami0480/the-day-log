import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../components/ThemedText";
import { CalendarView } from "./CalendarView";

type NewEntryProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: {
    title: string;
    story: string;
    date: Date;
    photo: string[];
  }) => void;
  onDelete?: () => void;
  initialData?: {
    title: string;
    story: string;
    date: Date;
    photo: string[];
  };
};

export function NewEntry({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
}: NewEntryProps) {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [date, setDate] = useState(new Date());
  const [photo, setPhoto] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Load initial data when editing
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setStory(initialData.story);
        setDate(new Date(initialData.date));
        setPhoto(initialData.photo || []);
      } else {
        setTitle("");
        setStory("");
        setDate(new Date());
        setPhoto([]);
      }
    }
  }, [visible, initialData]);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos");
      return;
    }
    if (photo.length >= 5) {
      Alert.alert("Limit reached", "You can only add up to 5 photos");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 5 - photo.length,
      quality: 0.5,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhoto([...photo, ...newPhotos].slice(0, 5));
    }
  };
  const handleSave = () => {
    // Send data back to parent
    onSave({ title, story, date, photo });
    setTitle("");
    setStory("");
    setDate(new Date());
    setPhoto([]);
    onClose();
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Entry",
      "Do you want to cancel? All changes will be lost.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            setTitle("");
            setStory("");
            setDate(new Date());
            setPhoto([]);
            onClose();
          },
        },
      ]
    );
  };
  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Do you want to delete? This cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            onDelete?.();
            onClose();
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const handleDateSelect = (dateString: string) => {
    // Convert "2025-12-06" string to Date
    const [year, month, day] = dateString.split("-").map(Number);
    setDate(new Date(year, month - 1, day));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/70">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center items-center">
              <View className="flex-col bg-white w-96 h-auto border border-gray-300 rounded-lg p-4">
                {/* Date - tap to open calendar */}
                <View className="flex items-center">
                  <TouchableOpacity
                    className="items-center w-40 mt-3 mb-10 rounded-md bg-[#D08A54] "
                    onPress={() => setShowCalendar(true)}
                  >
                    <ThemedText className="text-lg text-white">
                      {formatDate(date)}
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    placeholder="Title"
                    placeholderTextColor="#888"
                    className="border-b border-gray-800 font-semibold text-2xl mb-5"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
                {/* Photos - horizontal scroll */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  <View className="flex-row gap-2">
                    {/* Display selected photos */}
                    {photo.map((uri, index) => (
                      <View key={index} className="relative">
                        <TouchableOpacity onPress={() => setSelectedPhoto(uri)}>
                          <Image
                            source={{ uri }}
                            className="w-32 h-32 rounded-lg"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          className="absolute top-1 right-1 bg-black/50 rounded-full w-6 h-6 items-center justify-center"
                          onPress={() => {
                            setPhoto(photo.filter((_, i) => i !== index));
                          }}
                        >
                          <ThemedText className="text-white text-xs">
                            ✕
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {photo.length < 5 && (
                      <TouchableOpacity
                        className="border border-gray-300 rounded-lg w-32 h-32 items-center justify-center"
                        onPress={pickImage}
                      >
                        <ThemedText className="text-4xl text-gray-400">
                          +
                        </ThemedText>
                        <ThemedText className="text-gray-400 text-sm">
                          {photo.length}/5
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                </ScrollView>
                {/* Full size photo modal */}
                <Modal
                  visible={selectedPhoto !== null}
                  transparent
                  animationType="fade"
                >
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
                <TextInput
                  placeholder="Write your story.."
                  placeholderTextColor="#888"
                  className="text-lg mt-4 min-h-32"
                  multiline
                  textAlignVertical="top"
                  scrollEnabled={true}
                  value={story}
                  onChangeText={setStory}
                />
              </View>
              <View className="flex-row my-4 gap-4">
                <View className="w-20 h-8 bg-[#D08A54]  rounded-md flex justify-center items-center">
                  <TouchableOpacity onPress={handleSave}>
                    <ThemedText className="text-white text-lg">Save</ThemedText>
                  </TouchableOpacity>
                </View>
                <View className="w-20 h-8 bg-[#D08A54] rounded-md flex justify-center items-center">
                  <TouchableOpacity onPress={handleCancel}>
                    <ThemedText className="text-white text-lg">
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                {initialData && onDelete && (
                  <TouchableOpacity
                    className="w-20 h-8 bg-red-500 rounded-md flex justify-center items-center"
                    onPress={handleDelete}
                  >
                    <ThemedText className="text-white text-lg">
                      Delete
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <CalendarView
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        entryDates={[]}
        onDateSelect={handleDateSelect}
      />
    </Modal>
  );
}
