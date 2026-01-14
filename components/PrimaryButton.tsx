import styled from "styled-components/native";

interface Props {
  title: string;
  onPress: () => void;
  size?: "small" | "large";
  disabled?: boolean;
}

export default function PrimaryButton({title, onPress, size, disabled = false}: Props) {
  return (
    <Button onPress={onPress} size={size} disabled={disabled}>
      <ButtonText>{title}</ButtonText>
    </Button>
  );
}

const Button = styled.TouchableOpacity<{size?: "small" | "large"; disabled?: boolean}>`
  padding: 12px;
  background-color: ${({theme, disabled}) => (disabled ? theme.disabled : theme.primary)};
  border-radius: 8px;
  align-items: center;
  width: ${({size}) => (size === "small" ? "150px" : "100%")};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
