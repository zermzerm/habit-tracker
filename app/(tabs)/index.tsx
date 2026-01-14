import {useRouter} from "expo-router";
import {FlatList} from "react-native";
import styled from "styled-components/native";

import HabitItem from "@/components/HabitItem";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import {useHabit} from "@/hooks/useHabit";

export default function HomeScreen() {
  const router = useRouter();

  const {
    showCompleted,
    setShowCompleted,
    searchText,
    setSearchText,
    isEditMode,
    setIsEditMode,
    selectedIds,
    setSelectedIds,
    filteredHabits,
    allCompleted,
    progress,
    toggleAllHabits,
    handlePressHabit,
    deleteSelectedHabits,
  } = useHabit();

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
  border-bottom-color: ${({theme}) => theme.border};
  background-color: ${({theme}) => theme.background};
`;

const ActionText = styled.Text<{danger?: boolean}>`
  font-size: 16px;
  font-weight: 600;
  color: ${({theme, danger}) => (danger ? "#ef4444" : theme.primary)};
`;

const SortButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`;

const SearchInput = styled.TextInput`
  background-color: white;
  border: 1px solid ${({theme}) => theme.border};
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
  border-top-color: ${({theme}) => theme.border};
  background-color: ${({theme}) => theme.background};
`;

const SelectedCount = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.text};
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
