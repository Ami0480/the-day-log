import { Text } from "react-native";

export function ThemedText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text className={`text-black dark:text-white ${className}`}>
      {children}
    </Text>
  );
}
