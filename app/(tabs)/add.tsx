import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {useState} from "react";
import styled from "styled-components/native";

import PrimaryButton from "@/components/PrimaryButton";
import {Habit} from "@/types/Habit";

export default function AddScreen() {
  const [text, setText] = useState("");
  const router = useRouter();

  const addHabit = async () => {
    if (!text) return;

    const data = await AsyncStorage.getItem("habits");
    const habits: Habit[] = data ? JSON.parse(data) : [];

    await AsyncStorage.setItem(
      "habits",
      JSON.stringify([...habits, {id: Date.now(), title: text, completed: false}])
    );

    router.back();
  };

  return (
    <Container>
      <Input placeholder="새 습관 입력" value={text} onChangeText={setText} />
      <PrimaryButton title="저장" onPress={addHabit} />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Input = styled.TextInput`
  border: 1px solid ${({theme}) => theme.colors.border};
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;
