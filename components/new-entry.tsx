import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

import {
  Alert,
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
  onSave: (entry: { title: string; story: string }) => void;
};

export function NewEntry({ visible, onClose, onSave }: NewEntryProps) {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // Send data back to parent
    onSave({ title, story, date });
    setTitle("");
    setStory("");
    setDate(new Date());
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
            onClose();
          },
        },
      ]
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
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
              <View className="flex-col bg-white w-80 h-auto border border-gray-300 rounded-lg p-4 ">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="mb-4 p-3 bg-gray-100 rounded-lg"
                >
                  <ThemedText className="text-center text-lg">
                    {formatDate(date)}
                  </ThemedText>
                  <ThemedText className="text-center text-gray-500 text-sm">
                    Tap to change date
                  </ThemedText>
                </TouchableOpacity>

                {showDatePicker && (
                  <View className="items-center w-full">
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="compact"
                      onChange={onDateChange}
                    />
                  </View>
                )}

                <View>
                  <TextInput
                    placeholder="Title"
                    placeholderTextColor="#888"
                    className="border-b border-gray-800 font-semibold text-2xl mb-5"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <TouchableOpacity className="border border-gray-300 rounded-lg w-40 h-40"></TouchableOpacity>

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
