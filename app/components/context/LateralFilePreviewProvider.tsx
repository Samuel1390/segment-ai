"use client";
import { useState } from "react";
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

  // de esta forma si el usuario elimina los archivos del formulario
  // se cierra el lateral de previsualizacion
  const [filesOnForm, setFilesOnForm] = useState<File[] | null>(null);

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
