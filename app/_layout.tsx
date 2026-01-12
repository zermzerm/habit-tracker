import {theme} from "@/styles/theme";
import {Stack} from "expo-router";
import {ThemeProvider} from "styled-components/native";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{title: "습관 목록"}} />
        <Stack.Screen name="add" options={{title: "습관 추가"}} />
        <Stack.Screen name="settings" options={{title: "설정"}} />
      </Stack>
    </ThemeProvider>
  );
}
