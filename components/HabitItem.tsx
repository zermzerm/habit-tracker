import {Habit} from "@/types/Habit";
import styled from "styled-components/native";

interface Props {
  habit: Habit;
  onToggle: () => void;
}

export default function HabitItem({habit, onToggle}: Props) {
  return (
    <Item completed={habit.completed} onPress={onToggle}>
      <Title completed={habit.completed}>{habit.title}</Title>
    </Item>
  );
}

const Item = styled.TouchableOpacity<{completed: boolean}>`
  padding: 12px;
  border-radius: 8px;
  background-color: ${({completed, theme}) => (completed ? theme.colors.primary : "#f9fafb")};
`;

const Title = styled.Text<{completed: boolean}>`
  color: ${({completed}) => (completed ? "white" : "#111827")};
  text-decoration: ${({completed}) => (completed ? "line-through" : "none")};
`;
