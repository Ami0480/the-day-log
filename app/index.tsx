import { TouchableOpacity, View, useColorScheme } from "react-native";
import { ThemedView } from "../components/ThemedView";

import AddIcon from "../assets/images/add-icon.svg";
import HamburgerIcon from "../assets/images/hamburger-icon.svg";

export default function Index() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#000000";
  return (
    <ThemedView>
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity
          className="flex justify-center"
          onPress={() => console.log("Button pressed")}
        >
          <AddIcon width={40} height={40} fill={iconColor} />
        </TouchableOpacity>
        <HamburgerIcon width={50} height={50} fill={iconColor} />
      </View>
    </ThemedView>
  );
}
