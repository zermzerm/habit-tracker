import {Ionicons} from "@expo/vector-icons";
import {Tabs} from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 56, // 👈 높이 키우기 (중요)
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
        },
        headerShown: true,
        tabBarActiveTintColor: "#2563eb",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "습관",
          tabBarIcon: ({color, size}) => <Ionicons name="list" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "통계",
          tabBarIcon: ({color, size}) => <Ionicons name="bar-chart" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({color, size}) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
