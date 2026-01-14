import styled from "styled-components/native";

interface Props {
  progress: number; // 0 ~ 1
}

export default function ProgressBar({progress}: Props) {
  return (
    <Bar>
      <Fill progress={progress}>
        <Text>{progress * 100}%</Text>
      </Fill>
    </Bar>
  );
}

const Bar = styled.View`
  height: 20px;
  background-color: ${({theme}) => theme.border};
  border-radius: 5px;
  overflow: hidden;
`;

const Fill = styled.View<{progress: number}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: ${({progress}) => `${progress * 100}%`};
  background-color: ${({theme}) => theme.primary};
`;

const Text = styled.Text`
  padding-left: 5px;
  color: black;
  font-size: 15px;
`;
