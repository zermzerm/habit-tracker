import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect, useRouter} from "expo-router";
import {useCallback, useState} from "react";
import {FlatList} from "react-native";
import styled from "styled-components/native";

import HabitItem from "@/components/HabitItem";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import {Habit} from "@/types/Habit";

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const filteredHabits = habits
    .filter((h) => (showCompleted ? true : !h.completed))
    .filter((h) => h.title.toLowerCase().includes(searchText.toLowerCase()));

  const allCompleted = filteredHabits.length > 0 && filteredHabits.every((h) => h.completed);

  const completedCount = habits.filter((h) => h.completed).length;

  const progress = habits.length === 0 ? 0 : completedCount / habits.length;

  const toggleAllHabits = async () => {
    const targetIds = new Set(filteredHabits.map((h) => h.id));

    const updated = habits.map((h) => (targetIds.has(h.id) ? {...h, completed: !allCompleted} : h));

    setHabits(updated);
    await AsyncStorage.setItem("habits", JSON.stringify(updated));
  };

  const loadHabits = useCallback(() => {
    AsyncStorage.getItem("habits").then((data) => {
      if (data) setHabits(JSON.parse(data));
      else setHabits([]);
    });
  }, []);

  useFocusEffect(loadHabits);

  const toggleHabit = async (id: number) => {
    const updated = habits.map((h) => (h.id === id ? {...h, completed: !h.completed} : h));
    setHabits(updated);
    await AsyncStorage.setItem("habits", JSON.stringify(updated));
  };

  return (
    <Container>
      <ProgressBar progress={progress} />

      <PrimaryButton title="습관 추가" onPress={() => router.push("/add")} />
      <SortButtonContainer>
        <PrimaryButton
          title={allCompleted ? "전체 습관 해제" : "전체 습관 완료"}
          onPress={toggleAllHabits}
          disabled={filteredHabits.length === 0}
          size="small"
        />

        <PrimaryButton
          title={showCompleted ? "미완료만 보기" : "전체 보기"}
          onPress={() => setShowCompleted((prev) => !prev)}
          size="small"
        />
      </SortButtonContainer>

      <SearchInput placeholder="습관 검색" value={searchText} onChangeText={setSearchText} />

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <HabitItem habit={item} onToggle={() => toggleHabit(item.id)} />}
        contentContainerStyle={{gap: 8, marginTop: 16}}
      />
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  gap: 12px;
  padding: 16px;
`;

const SortButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`;

const SearchInput = styled.TextInput`
  border: 1px solid ${({theme}) => theme.colors.border};
  padding: 10px;
  border-radius: 8px;
  margin-top: 12px;
`;
