import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import "../global.css";
import { auth } from "../src/firebaseConfig";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const currentPage = segments[0];

    if (!user && currentPage !== "login") {
      router.replace("/login");
    } else if (
      user &&
      (currentPage === "login" || currentPage === "index" || !currentPage)
    ) {
      router.replace("/log-page");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#111827" : "#ffffff",
        },
        headerTintColor: colorScheme === "dark" ? "#ffffff" : "#000000",
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#111827" : "#ffffff",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="log-page" options={{ title: "Home" }} />
      <Stack.Screen name="diary" options={{ title: "My Diary" }} />
    </Stack>
  );
}
