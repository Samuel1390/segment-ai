import { RetryIcon } from "@/components/icons/pajamas-retry";
import { Ref } from "react";
import { LastUserMessage } from "../../hooks/useChatState";
import { FileIcon } from "lucide-react";

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
  return (
    <div className="w-full flex flex-col items-end gap-1 mb-4" ref={ref}>
      <div
        className={`p-3 rounded-lg w-fit bg-neutral-200 overflow-y-hidden shadow-md shadow-neutral-700/40 mr-1
        text-neutral-950 dark:bg-neutral-200 dark:text-neutral-800 text-right
        ml-auto max-w-[80%]`}
      >
        <p className="text-sm font-bold mb-1">Tú</p>
        <p className="text-md">{userMessage.prompt}</p>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        {userMessage.files &&
          userMessage.files.length > 0 &&
          userMessage.files.map((file, i) => (
            <div
              key={`${i}-${file.name}-${file.size}`}
              className="flex sm:flex-row items-center  gap-1.5 px-3 py-1.5 mt-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium border border-blue-200 dark:border-blue-900/50 text-sm sm:text-md"
            >
              <FileIcon size={14} />
              <span className="">{userMessage.filesNames?.[i]}</span>
            </div>
          ))}
      </div>
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
