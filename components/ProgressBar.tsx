import styled from "styled-components/native";

interface Props {
  progress: number; // 0 ~ 1
}

export default function ProgressBar({progress}: Props) {
  return (
    <Bar>
      <Fill progress={progress}>{progress * 100}%</Fill>
    </Bar>
  );
}

const Bar = styled.View`
  color: black;
  font-size: 15px;
  height: 20px;
  background-color: ${({theme}) => theme.colors.border};
  border-radius: 5px;
  overflow: hidden;
  /* display: flex;
  align-items: center;
  justify-content: center; */
`;

const Fill = styled.View<{progress: number}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: ${({progress}) => `${progress * 100}%`};
  background-color: ${({theme}) => theme.colors.primary};
  padding-left: 5px;
`;
