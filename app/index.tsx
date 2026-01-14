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
  // 저장된 모든 습관 목록
  const [habits, setHabits] = useState<Habit[]>([]);
  // 완료된 습관을 목록에서 보여줄지 여부
  const [showCompleted, setShowCompleted] = useState(true);
  // 습관 검색 입력값
  const [searchText, setSearchText] = useState("");
  // 삭제 모드 여부 (true면 체크박스 + 삭제 바 표시)
  const [isEditMode, setIsEditMode] = useState(false);
  // 삭제 모드에서 선택된 습관 id 목록
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const router = useRouter();

  // 필터링된 습관 목록
  // 1. 완료 여부 필터
  // 2. 검색어 필터
  const filteredHabits = habits
    .filter((h) => (showCompleted ? true : !h.completed))
    .filter((h) => h.title.toLowerCase().includes(searchText.toLowerCase()));

  // 현재 화면에 보이는 습관이 전부 완료 상태인지 여부
  const allCompleted = filteredHabits.length > 0 && filteredHabits.every((h) => h.completed);

  // 전체 습관 중 완료된 개수
  const completedCount = habits.filter((h) => h.completed).length;

  // 진행률 (0 ~ 1)
  const progress = habits.length === 0 ? 0 : completedCount / habits.length;

  /**
   * 현재 화면에 보이는 습관들을
   * 모두 완료하거나, 모두 미완료로 토글하는 함수
   */
  const toggleAllHabits = async () => {
    // 현재 필터된 습관들의 id 집합
    const targetIds = new Set(filteredHabits.map((h) => h.id));
    // 해당 id에 포함된 습관만 완료 상태 변경
    const updated = habits.map((h) => (targetIds.has(h.id) ? {...h, completed: !allCompleted} : h));
    setHabits(updated);
    await AsyncStorage.setItem("habits", JSON.stringify(updated));
  };

  /**
   * 습관 아이템을 눌렀을 때 동작
   * - 일반 모드: 완료/미완료 토글
   * - 삭제 모드: 선택/선택해제
   */
  const handlePressHabit = (id: number) => {
    if (!isEditMode) {
      toggleHabit(id);
      return;
    }
    // 삭제 모드일 때 선택 토글
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  /**
   * AsyncStorage에 저장된 습관 목록을 불러오는 함수
   * 화면에 다시 포커스될 때마다 실행됨
   */
  const loadHabits = useCallback(() => {
    AsyncStorage.getItem("habits").then((data) => {
      if (data) setHabits(JSON.parse(data));
      else setHabits([]);
    });
  }, []);
  // 홈 화면에 들어올 때마다 습관 목록 로드
  useFocusEffect(loadHabits);

  /**
   * 특정 습관의 완료 상태를 토글하는 함수
   */
  const toggleHabit = async (id: number) => {
    const updated = habits.map((h) => (h.id === id ? {...h, completed: !h.completed} : h));
    setHabits(updated);
    await AsyncStorage.setItem("habits", JSON.stringify(updated));
  };

  /**
   * 삭제 모드에서 선택된 습관들을
   * 한 번에 삭제하는 함수
   */
  const deleteSelectedHabits = async () => {
    if (selectedIds.length === 0) return;

    // 선택되지 않은 습관만 남김
    const updated = habits.filter((h) => !selectedIds.includes(h.id));

    setHabits(updated);
    setSelectedIds([]);
    setIsEditMode(false);

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

      <Header>
        {!isEditMode ? (
          <ActionButton onPress={() => setIsEditMode(true)}>
            <ActionText>삭제</ActionText>
          </ActionButton>
        ) : (
          <ActionButton
            onPress={() => {
              setIsEditMode(false);
              setSelectedIds([]);
            }}
          >
            <ActionText danger={isEditMode}>취소</ActionText>
          </ActionButton>
        )}
      </Header>

      <SearchInput placeholder="습관 검색" value={searchText} onChangeText={setSearchText} />

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <HabitItem
            habit={item}
            isEditMode={isEditMode}
            selected={selectedIds.includes(item.id)}
            onPress={() => handlePressHabit(item.id)}
          />
        )}
      />
      {isEditMode && (
        <DeleteBar>
          <SelectedCount>{selectedIds.length}개 선택됨</SelectedCount>

          <DeleteButton disabled={selectedIds.length === 0} onPress={deleteSelectedHabits}>
            <DeleteButtonText>삭제하기</DeleteButtonText>
          </DeleteButton>
        </DeleteBar>
      )}
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  /* height: 100%; */
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const ActionButton = styled.TouchableOpacity`
  height: 48px;
  width: 150px;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.background};
`;

const ActionText = styled.Text<{danger?: boolean}>`
  font-size: 16px;
  font-weight: 600;
  color: ${({theme, danger}) => (danger ? "#ef4444" : theme.colors.primary)};
`;

const SortButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`;

const SearchInput = styled.TextInput`
  background-color: white;
  border: 1px solid ${({theme}) => theme.colors.border};
  padding: 10px;
  border-radius: 8px;
  margin-top: 12px;
`;

const DeleteBar = styled.View`
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.background};
`;

const SelectedCount = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
`;

const DeleteButton = styled.TouchableOpacity<{disabled: boolean}>`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${({disabled}) => (disabled ? "#d1d5db" : "#ef4444")};
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const DeleteButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;
