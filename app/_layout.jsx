import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="event/[id]"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
