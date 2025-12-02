import { ImageBackground, useColorScheme } from "react-native";

export function ThemedView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const colorScheme = useColorScheme();

  const bgImage =
    colorScheme === "dark"
      ? require("../assets/images/bg-black.jpg")
      : require("../assets/images/bg-white.jpg");

  return (
    <ImageBackground
      source={bgImage}
      className={`flex-1 ${className}`}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}
