import {Habit} from "@/types/Habit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "expo-router";
import {useCallback, useState} from "react";

export function useHabit() {
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

  return {
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
  };
}
