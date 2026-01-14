import {theme} from "@/styles/theme";
import {Stack} from "expo-router";
import {ThemeProvider} from "styled-components/native";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" options={{title: "습관 추가", headerShown: true}} />
      </Stack>
    </ThemeProvider>
  );
}
