import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";
import styled from "styled-components/native";

import PrimaryButton from "@/components/PrimaryButton";

export default function SettingsScreen() {
  const resetHabits = async () => {
    Alert.alert("초기화", "모든 습관을 삭제할까요?", [
      {text: "취소", style: "cancel"},
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("habits");
        },
      },
    ]);
  };

  return (
    <Container>
      <PrimaryButton title="전체 습관 초기화" onPress={resetHabits} />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;
