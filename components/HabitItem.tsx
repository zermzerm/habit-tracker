import {Habit} from "@/types/Habit";
import styled from "styled-components/native";

interface Props {
  habit: Habit;
  isEditMode: boolean;
  selected: boolean;
  onPress: () => void;
}

export default function HabitItem({habit, isEditMode, selected, onPress}: Props) {
  return (
    <Item onPress={onPress} selected={selected} completed={habit.completed} isEditMode={isEditMode}>
      {isEditMode && <Checkbox selected={selected} />}
      <Title completed={habit.completed}>{habit.title}</Title>
    </Item>
  );
}

const Title = styled.Text<{completed: boolean}>`
  color: #111827;
`;

const Item = styled.TouchableOpacity<{isEditMode: boolean; selected: boolean; completed?: boolean}>`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  border-radius: 8px;
  background-color: ${({completed, selected, isEditMode, theme}) => {
    if (isEditMode) {
      return selected ? theme.colors.primaryLight : theme.colors.background;
    }
    return completed ? theme.colors.primary : theme.colors.background;
  }};

  border: 1px solid
    ${({selected, isEditMode, theme}) =>
      isEditMode && selected ? theme.colors.primary : theme.colors.border};
`;

const Checkbox = styled.View<{selected: boolean}>`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border-radius: 4px;
  border: 2px solid ${({theme}) => theme.colors.primary};
  background-color: ${({selected, theme}) => (selected ? theme.colors.primary : "transparent")};
`;
