import DateTimePicker from "@react-native-community/datetimepicker";
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

type NewEntryProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: {
    title: string;
    story: string;
    date: Date;
    photo: string[];
  }) => void;
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
  initialData,
}: NewEntryProps) {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [date, setDate] = useState(new Date());
  const [photo, setPhoto] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              <View className="flex-col bg-white w-96 h-auto border border-gray-300 rounded-lg p-4 ">
                <View className="items-center w-full mb-5">
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="compact"
                    onChange={onDateChange}
                  />
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
              <View className="flex-row my-2 gap-2">
                <View className="w-20 h-8 bg-orange-300 rounded-sm flex justify-center items-center">
                  <TouchableOpacity
                    className=" text-white"
                    onPress={handleSave}
                  >
                    <ThemedText>Save</ThemedText>
                  </TouchableOpacity>
                </View>
                <View className="w-20 h-8 bg-orange-300 rounded-sm flex justify-center items-center">
                  <TouchableOpacity
                    className=" text-white"
                    onPress={handleCancel}
                  >
                    <ThemedText>Cancel</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
