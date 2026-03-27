import type { Value } from "./ThemeProvider";
import { createContext } from "react";
const ThemeContext = createContext<Value | null>(null);
export default ThemeContext;
