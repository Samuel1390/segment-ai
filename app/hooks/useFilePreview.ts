import { useContext } from "react";
import LateralFilePreviewContext from "../components/context/LateralFilePreviewContext";

function useFilePreview() {
  const context = useContext(LateralFilePreviewContext);
  if (!context) {
    throw new Error(
      "useFilePreview must be used within a LateralFilePreviewProvider",
    );
  }
  return context;
}

export default useFilePreview;
