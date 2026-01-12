import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      background: string;
      primary: string;
      text: string;
      gray: string;
      border: string;
      disabled: string;
    };
  }
}
