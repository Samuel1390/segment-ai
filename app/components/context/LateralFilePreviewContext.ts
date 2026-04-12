import type { Value } from "./LateralFilePreviewProvider";
import { createContext } from "react";
const LateralFilePreviewContext = createContext<Value | null>(null);
export default LateralFilePreviewContext;
