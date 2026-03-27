"use client";

import { useEffect } from "react";

export default function usePreventSelectScroll() {
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      // Evita que el navegador haga scroll automático al ganar foco
      if ((e.target as HTMLElement).tagName === "SELECT") {
        (e.target as HTMLElement).focus({ preventScroll: true });
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);
}
