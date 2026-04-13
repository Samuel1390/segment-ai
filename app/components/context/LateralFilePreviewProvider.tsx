"use client";
import { useEffect, useState } from "react";
import LateralFilePreviewContext from "./LateralFilePreviewContext";

export type Value = {
  file: File | null;
  setFile: (file: File | null) => void;
  isLateralFilePreviewOpen: boolean;
  setIsLateralFilePreviewOpen: (isLateralFilePreviewOpen: boolean) => void;
  filesOnForm: File[] | null;
  setFilesOnForm: (filesOnForm: File[] | null) => void;
};

function LateralFilePreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isLateralFilePreviewOpen, setIsLateralFilePreviewOpen] =
    useState(false);
  // este estados lo uso para "vincular" el archivo que se
  // esta previsualizando con el archivo que se esta enviando
  const [filesOnForm, setFilesOnForm] = useState<File[] | null>(null);
  // de esta forma si el usuario elimina los archivos del formulario
  // se cierra el lateral de previsualizacion

  useEffect(() => {
    if (filesOnForm && file) {
      // Resolvimos un problema serio con esto
      const fileMatch = filesOnForm.find((fl) => fl === file);
      if (!fileMatch) {
        setFile(null);
      }
    }
  }, [filesOnForm]);

  return (
    <LateralFilePreviewContext.Provider
      value={{
        file,
        setFile,
        isLateralFilePreviewOpen,
        setIsLateralFilePreviewOpen,
        filesOnForm,
        setFilesOnForm,
      }}
    >
      {children}
    </LateralFilePreviewContext.Provider>
  );
}

export default LateralFilePreviewProvider;
