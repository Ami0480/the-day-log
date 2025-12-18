import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import {
  emailSignIn,
  emailSignUp,
  useGoogleAuth,
} from "../src/auth/authMethods";

import { useEffect } from "react";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const colorScheme = useColorScheme();

  const { request, response, promptAsync, handleGoogleResponse } =
    useGoogleAuth();
  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    const result = isSignUp
      ? await emailSignUp(email, password)
      : await emailSignIn(email, password);

    if (!result.success) {
      Alert.alert("Error", result.error?.message || "Authentication failed");
    }
  };

  const bgColor = colorScheme === "dark" ? "bg-gray-900" : "bg-[#FFF6E8]";
  const textColor = colorScheme === "dark" ? "text-white" : "text-black";
  const inputBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <View className={`flex-1 justify-center px-8 ${bgColor}`}>
      <Text className={`text-3xl font-bold text-center mb-8 ${textColor}`}>
        The Day Log
      </Text>

      <TextInput
        className={`${inputBg} ${textColor} rounded-lg px-4 py-3 mb-4`}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className={`${inputBg} ${textColor} rounded-lg px-4 py-3 mb-6`}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-[#F4A373] rounded-lg py-3 mb-4"
        onPress={handleEmailAuth}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text className="text-[#F4A373]  text-center mb-6">
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3"
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Sign in with Google
        </Text>
        //{" "}
      </TouchableOpacity> */}
    </View>
  );
}
