import { Modal, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { ThemedText } from "./ThemedText";

type CalendarViewProps = {
  visible: boolean;
  onClose: () => void;
  entryDates: string[];
  onDateSelect: (date: string) => void;
};

export function CalendarView({
  visible,
  onClose,
  entryDates,
  onDateSelect,
}: CalendarViewProps) {
  // Create marked dates object with dots
  const markedDates: {
    [key: string]: {
      marked: boolean;
      dotColor: string;
    };
  } = {};
  entryDates.forEach((date) => {
    markedDates[date] = { marked: true, dotColor: "#F4A373" };
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-4 dark:bg-gray-800">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-xl font-bold">Calendar</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText className="text-[#F4A373] text-lg">Close</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => {
              onDateSelect(day.dateString);
              onClose();
            }}
            theme={{
              todayTextColor: "#F4A373",
              selectedDayBackgroundColor: "#F4A373",
              arrowColor: "#F4A373",
              dotColor: "#F4A373",
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
