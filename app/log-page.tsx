import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { logOut } from "../src/auth/authMethods";

export default function LogPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const bgColor = colorScheme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = colorScheme === "dark" ? "text-white" : "text-black";

  return (
    <View className={`flex-1 justify-center items-center ${bgColor}`}>
      <Text className={`text-2xl font-bold mb-8 ${textColor}`}>
        Welcome to The Day Log
      </Text>

      <TouchableOpacity
        className="bg-orange-400 rounded-full w-20 h-20 justify-center items-center mb-8"
        onPress={() => router.push("/diary")}
      >
        <Text className="text-white text-3xl">📝</Text>
      </TouchableOpacity>

      <Text className="text-gray-500 mb-8">Tap to write your story</Text>

      <TouchableOpacity onPress={logOut}>
        <Text className="text-orange-400">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
