"use client";
import { RetryIcon } from "@/components/icons/pajamas-retry";
import { Ref } from "react";
import { LastUserMessage } from "../../hooks/useChatState";
import useFilePreview from "../../hooks/useFilePreview";
import { FileIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { getIcon } from "omni-file";

interface RenderUserMessageProps {
  userMessage: LastUserMessage;
  failed?: boolean;
  retry?: () => void;
  ref?: Ref<HTMLDivElement>;
}

const RenderUserMessage = ({
  userMessage,
  failed,
  retry,
  ref,
}: RenderUserMessageProps) => {
  const {
    setFile,
    isLateralFilePreviewOpen,
    setIsLateralFilePreviewOpen,
    file: CurrentFileOnPreview,
  } = useFilePreview();

  return (
    <div className="w-full flex flex-col items-end gap-1 mb-4" ref={ref}>
      {/* CONTENEDOR PARA EL MENSAJE DEL USUARIO */}
      <div
        style={{
          scrollbarColor: "#aaa transparent",
        }}
        className={`p-3 rounded-lg w-fit bg-neutral-200 max-h-40 overflow-y-auto shadow-md shadow-neutral-700/40 mr-1
        text-neutral-950 dark:bg-neutral-200 dark:text-neutral-800 text-right
        ml-auto max-w-[80%]`}
      >
        <p className="text-sm font-bold mb-1">Tú</p>
        <p className="text-md">{userMessage.prompt}</p>
      </div>
      {/*------- Contenido extra del mensaje -------- */}

      {/* CONTENEDOR PARA LOS ARCHIVOS ADJUNTOS */}
      <div className="flex gap-2 flex-wrap justify-end">
        {userMessage.files &&
          userMessage.files.length > 0 &&
          userMessage.files.map((file, i) => (
            <HoverCard key={`${i}-${file.name}-${file.size}`}>
              <HoverCardTrigger>
                <div
                  onClick={() => {
                    if (
                      CurrentFileOnPreview === file &&
                      isLateralFilePreviewOpen
                    ) {
                      setIsLateralFilePreviewOpen(false);
                    } else {
                      setIsLateralFilePreviewOpen(true);
                    }
                    setFile(file);
                  }}
                  className="flex sm:flex-row items-center cursor-pointer gap-1.5 px-3 py-1.5 mt-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium border border-blue-200 dark:border-blue-900/50 text-sm sm:text-md"
                >
                  {getIcon(file.name) ? (
                    <Image
                      src={`/icons/${getIcon(file.name)}.svg`}
                      alt={file.name}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  ) : (
                    <FileIcon size={16} />
                  )}
                  <span className="">{userMessage.filesNames?.[i]}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <p>Ver contenido de {file.name}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
      </div>
      {/* si el mensaje fallo, se muestra un boton de reintentar */}
      {failed && retry && (
        <button
          type="button"
          onClick={retry}
          className="flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors text-xs font-medium border border-red-200 dark:border-red-900/50"
        >
          <RetryIcon size={14} /> Reintentar
        </button>
      )}
    </div>
  );
};
export default RenderUserMessage;
