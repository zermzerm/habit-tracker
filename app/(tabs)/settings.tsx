import {useThemeStore} from "@/store/useThemeStore";
import {Switch} from "react-native";
import styled, {useTheme} from "styled-components/native";

export default function SettingsScreen() {
  const {isDark, toggle} = useThemeStore();
  const theme = useTheme();

  return (
    <Container>
      <Row>
        <Label>다크 모드</Label>

        <Switch
          value={isDark}
          onValueChange={toggle}
          trackColor={{
            false: theme.gray,
            true: theme.primary,
          }}
          thumbColor={isDark ? "#ffffff" : "#f4f4f5"}
          ios_backgroundColor={theme.gray}
        />
      </Row>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({theme}) => theme.background};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  border-radius: 12px;
  background-color: ${({theme}) => theme.primaryLight};
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({theme}) => theme.text};
`;
