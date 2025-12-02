import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#111827" : "#ffffff",
        },
        headerTintColor: colorScheme === "dark" ? "#ffffff" : "#000000",
        headerTitle: "The Day Log",
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#111827" : "#ffffff",
        },
      }}
    />
  );
}
