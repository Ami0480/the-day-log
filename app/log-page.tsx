import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { logOut } from "../src/auth/authMethods";

export default function LogPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const bgColor = colorScheme === "dark" ? "bg-gray-900" : "bg-[#FFF6E8]";
  const textColor = colorScheme === "dark" ? "text-white" : "text-black";

  return (
    <View className={`flex-1 justify-center items-center ${bgColor}`}>
      <Text className={`text-2xl font-bold mb-8 ${textColor}`}>
        Welcome to The Day Log
      </Text>

      <TouchableOpacity
        className="bg-[#DCE8D2] rounded-full w-50 h-50 justify-center items-center mb-8"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8, // for Android
        }}
        onPress={() => router.push("/diary")}
      >
        <Image
          source={require("../assets/images/log-icon.png")}
          style={{ width: 100, height: 100 }}
        />
      </TouchableOpacity>

      <Text className="text-gray-500 mb-8">Tap to write your story</Text>

      <TouchableOpacity onPress={logOut}>
        <Text className="text-[#F4A373]">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
