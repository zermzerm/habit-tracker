import {ThemeType} from "@/styles/theme";
import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
